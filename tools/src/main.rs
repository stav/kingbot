use std::env;
use std::fmt::format;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::str::FromStr;

use chrono::{Datelike, Duration};
use chrono::prelude::{DateTime, NaiveDate, Utc};
use clap::Parser;
use colored::{ColoredString, Colorize};
use regex::{Regex, Captures};
use serde_derive::Deserialize;
use serde_json::Value;

const FILENAME: &str = "../logs/kingbot.log";

const PREAMBLE_RE_STRING: &str = r"(?x)^
    (?P<dt>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2} \s UTC) \s
    (?:DEBUG | INFO | WARNING | ERROR | CRITICAL) \s
    \[[a-z]+\] \s
    ";
const PARSED_RE_STRING: &str = r#"(?x)
    Parser \s
    \[Function: \s (?P<parser>.+)\] \s
    "Parsed" \s
    \{ [^}]+ \} \s
    "Signal" \s
    (?P<signal>\{ [^}]+ \})
    "#;
const SIGNAL_RE_STRING_LEGACY: &str = r#"(?x)
    Signal \s
    (?P<signal>\{ [^}]+ \}) \s
    "Eindexs" \s (?P<eindex>\[[\d,\s]*\]) \s
    (?P<rest>.+)
    "#;
const SIGNAL_RE_STRING: &str = r#"(?x)
    Telegram-server-signal \s
    '(?P<signal>.+)'
    "#;
const ORDER_RE_STRING: &str = r#"(?x)
    Sending .+
    customTag: \s "(?P<tag>[0-9.]+) \s Order \s (?P<i>\d+) \s of \s (?P<n>\d+)" .+
    account[:"] \s (?P<account>\{[^}]+\})
    "#;
const MESSAGE_RE_STRING: &str = r#"(?x)
    (?P<description>[\w\d\s:"/.-]*) \s?
    '?(?P<json>\{.+\})'?
    "#;

#[derive(Debug)]
struct Log {
    index: usize,
    line: String,
    dt: DateTime<Utc>,
}

#[derive(Deserialize, Debug, PartialEq)]
struct Account {
    id: usize,
    name: String,
    r#type: String,
}

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// How many days back are we going to narrow
    #[clap(short, long, value_parser)]
    days: Option<i64>,

    /// What specific date should we narrow for
    #[clap(short = 'a', long, value_parser)]
    date: Option<String>,

    /// Search term
    #[clap(short, long, value_parser)]
    term: Option<String>,
}

/**
 * Open the log file in read-only mode (ignoring errors).
 */
fn reader() -> BufReader<File> {
    BufReader::new( File::open(FILENAME).unwrap() )
}

/**
 * Assemble multi-line log entries together into individual entries and
 * push them one at a time onto a stack.
 */
fn assemble(logs: &mut Vec<Log>) {
    let preamble_re = Regex::new(PREAMBLE_RE_STRING).unwrap();
    let mut log = String::new();
    let mut log_start_index = 0;

    let mut add = |log: &str, index: usize| {
        let preamble = preamble_re.captures(log).unwrap();
        let dt = preamble.name("dt").unwrap().as_str();
        logs.push(Log{
            index,
            line: String::from(log),
            dt: DateTime::from_str(dt).unwrap(),
        });
    };

    for (i, line) in reader().lines().enumerate() {
        let line = line.unwrap();
        if preamble_re.is_match(&line) {
            if !log.is_empty() {
                add(&log, log_start_index);
                log = "".to_string();
            }
            log_start_index = i;
        }
        log.push_str(&line);
    }
    if !log.is_empty() {
        add(&log, log_start_index);
    }
}

/** */
fn narrow(logs: Vec<Log>) -> Vec<Log> {
    let today = || -> NaiveDate {
        let dt = Utc::now();
        NaiveDate::from_ymd(dt.year(), dt.month(), dt.day())
    };
    let back_date = || -> NaiveDate {
        match Args::parse().days {
            Some(days) => today() - Duration::days(days),
            // Some(days) => today.checked_sub_signed(Duration::days(days)).unwrap(),
            None => NaiveDate::from_ymd(2022, 1, 1),
        }
    };
    let start_date = match Args::parse().date.as_deref() {
        Some(d) => NaiveDate::parse_from_str(d, "%Y-%m-%d").unwrap(),
        None => back_date(),
    };
    println!("Start date {start_date}");
    let later = |log: &Log| -> bool {
        let dt = log.dt;
        let log_date = NaiveDate::from_ymd(dt.year(), dt.month(), dt.day());
        log_date >= start_date
    };
    logs.into_iter().filter(later).collect()
}

/**
 * Main
 *
 * Note that printing to stdout via print!/println! is line-buffered in Rust.
 * This means that if your json is large and spans many lines, printing it may
 * be much slower than desirable. If your program is multithreaded, it may also
 * lead to garbled output (print! acquires a lock on stdout, but it obviously
 * doesn't persist between different print! calls). Consider first printing the
 * struct to an in-memory buffer, and then writing it to stdout in a single call.
 * This may be too much trouble depending on your use case, e.g. if the function
 * is only used for debugging.
 * https://users.rust-lang.org/t/array-hackery-not-so-pretty/76404/5?u=stav
 */
fn main() {
    let mut logs: Vec<Log> = Vec::new();

    println!("{}", "K1NGLAT: Log Analysis Tool".green());
    println!("Arguments {} ({:?})", env::args().len(), env::args());

    assemble(&mut logs);
    println!("{} logs assembled", logs.len());

    logs = narrow(logs);
    println!("{} logs after narrowing", logs.len());

    let term = match Args::parse().term.as_deref() {
        Some(t) => t.to_string(),
        None => String::new(),
    };
    if term.is_empty() {
        println!("Express.\n");
        express_logs(logs);
    }
    else {
        println!("Search '{term}'.\n");
        search_term(logs, &term);
    }
}

/**
 * Go thru each log entry and display it if is either a:
 *
 * - parser entry
 * - signal entry
 * - order entry
 */
fn express_logs(logs: Vec<Log>) {

    let order_re = Regex::new(ORDER_RE_STRING).unwrap();
    let parsed_re = Regex::new(PARSED_RE_STRING).unwrap();
    let signal_re = Regex::new(SIGNAL_RE_STRING).unwrap();
    let signal_re_legacy = Regex::new(SIGNAL_RE_STRING_LEGACY).unwrap();

    for (i, log) in logs.iter().enumerate() {
        if parsed_re.is_match(&log.line) {
            express_parser(log, parsed_re.captures(&log.line).unwrap());
        }
        else if signal_re_legacy.is_match(&log.line) {
            express_legacy_signal(log, signal_re_legacy.captures(&log.line).unwrap());
        }
        else if signal_re.is_match(&log.line) {
            express_signal(log, signal_re.captures(&log.line).unwrap());
        }
        else if order_re.is_match(&log.line) {
            let tail = &logs[i+1..];
            process_order(tail, log, order_re.captures(&log.line).unwrap());
        }
    }
}

fn express_parser(log: &Log, re: Captures) {
    println!("\n\n{}. {} ({}) [Parser {}] {}",
        log.index+1,
        log.dt,
        log.line.len(),
        re.name("parser").unwrap().as_str(),
        re.name("signal").unwrap().as_str(),
    );
}

fn express_signal(log: &Log, re: Captures) {
    let signal_str = re.name("signal").unwrap().as_str();
    let signal = serde_json::from_str(signal_str).unwrap();
    println!("{}. {} ({}) Signal: {}",
        log.index+1,
        log.dt,
        log.line.len(),
        format_json(signal, None),
    );
}

fn express_legacy_signal(log: &Log, re: Captures) {
    // let signal = re.name("signal").unwrap().as_str();
    println!("{}. {} ({}) Eindexs {} {}",
        log.index+1,
        log.dt,
        log.line.len(),
        re.name("eindex").unwrap().as_str(),
        re.name("rest").unwrap().as_str(),
    );
}

fn process_order(logs: &[Log], log: &Log, re: Captures) {
    let tag = re.name("tag").unwrap().as_str();
    let order = get_order_num(logs, tag);
    match order {
        "" => express_order("?????????", "result", log, re),
        _ => {
            let tail = &logs[1..];
            let result = get_order_res(tail, order);
            express_order(order, result.as_str(), log, re);
        },
    };
}

fn get_order_num<'a>(logs: &'a [Log], tag: &'a str) -> &'a str {
    let tag_index = logs.iter().position(|log| log.line.contains(tag)).unwrap();
    let order_re_string = &[r#"\{"order":(\d+)\},"customTag":""#, tag].join("");
    let order_re = Regex::new(order_re_string).unwrap();
    let line = &logs[tag_index].line;
    match order_re.captures(line) {
        Some(order_cap) => order_cap.get(1).unwrap().as_str(),
        None => "",
    }
}

fn get_order_res(logs: &[Log], order: &str) -> String {
    let order_string = &[r#""order""#, order].join(" ");
    let log = logs.iter().find(|log| log.line.contains(order_string)).unwrap();
    let result_re_string = r#""(?P<status>\w+)" "(?P<msg>[^"]*)"$"#;
    let result_re = Regex::new(result_re_string).unwrap();
    let result_cap = result_re.captures(&log.line).unwrap();
    let status = result_cap.name("status").unwrap().as_str();
    let message = result_cap.name("msg").unwrap().as_str();
    format(format_args!("{} {}", status, message))
}

fn express_order(order: &str, result: &str, log: &Log, re: Captures) {
    let account_str = re.name("account").unwrap().as_str();
    let account: Account = json5::from_str(account_str).unwrap();
    println!("{}. {} ({}) Order {} {}/{} {} tag {} for account {} {}",
        log.index + 1,
        log.dt,
        log.line.len(),
        order,
        re.name("i").unwrap().as_str(),
        re.name("n").unwrap().as_str(),
        result.trim(),
        re.name("tag").unwrap().as_str(),
        account.id,
        account.name.split_ascii_whitespace().next().unwrap(),
    );
}

fn search_term(logs: Vec<Log>, term: &str) {
    let message_re_string = [PREAMBLE_RE_STRING, MESSAGE_RE_STRING].join(" ");
    let message_re = Regex::new(&message_re_string).unwrap();
    let logs_with_term = logs.iter().filter(|log| log.line.contains(&term));
    let mut base_time: Option<DateTime<Utc>> = None;

    for (i, log) in logs_with_term.enumerate() {
        print!("\n{} ", (i + 1).to_string().black().on_blue());
        // If our regex on the log line parses
        if let Some(message_cap) = message_re.captures(&log.line) {
            if base_time.is_none() {
                base_time = Some(log.dt);
            }
            let diff = log.dt.signed_duration_since(base_time.unwrap());
            print!("{}. {} {} ({}) {} ",
                log.index + 1,
                diff.num_seconds().to_string().yellow().on_black().dimmed(),
                log.dt,
                log.line.len(),
                message_cap.name("description").unwrap().as_str(),
            );
            let message_str = message_cap.name("json").unwrap().as_str();
            println!("{}",
                match json5::from_str(message_str) {
                    Ok(parsed_json) => format_json(parsed_json, Some(term)),
                    Err(_) => (&message_str.red()).to_string(),
                }
            );
        }
        // Else we have an unknown log line format
        else {
            let log = format!("{:?}", log).as_str().yellow();
            println!("{}", log);
        }
    }
}

fn format_json(parsed_json: Value, highlight: Option<&str>) -> String {
    let object = parsed_json.as_object().unwrap();

    let style = |value: &Value| -> ColoredString {
        let value = value.to_string();
        if value.contains(highlight.unwrap_or("-000999")) {
            value.as_str().yellow()
        } else {
            value.as_str().normal()
        }
    };

    let mut output = String::new();
    for (key, value) in object {
        output += &format!("\n  {}: ", key.green());

        // Check (non-recursively) if value is itself a nested-object
        if let Some(value) = value.as_object() {
            for (nested_key, nested_value) in value {
                output += &format!("\n    {}: {}", nested_key.green(), style(nested_value));
            }
        }
        // Check (non-recursively) if value is itself a nested-array
        else if let Some(arr) = value.as_array() {
            if arr.iter().all(Value::is_array) {
                for inner_array in arr.iter().filter_map(Value::as_array) {
                    output += "\n";
                    for (i, object) in inner_array.iter().filter_map(Value::as_object).enumerate() {
                        output += &format!("\n     {} - ", i + 1);
                        for (key, value) in object {
                            output += &format!("{}:{}  ", key.green(), style(value));
                        }
                    }
                }
            }
            else {
                output += &format!("{}", style(value));
            }
        }
        // value is not an object nor an array
        else {
            output += &format!("{}", style(value));
        }
    }
    output
}
