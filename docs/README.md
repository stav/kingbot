# Documentation Setup

- [Primary guide](https://jekyllrb.com/tutorials/using-jekyll-with-bundler)
- [Secondary guide](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll#creating-your-site)

## Install

┌─[stav][legion][±][gh-pages {1} ✓][~/.../kingbot/docs]
└─▪ bundle init
Writing new Gemfile to /home/stav/Work/KingBot/kingbot/docs/Gemfile

└─▪ bundle config set --local path 'vendor/bundle'

└─▪ bundle add jekyll --version=3.9.0
Fetching gem metadata from https://rubygems.org/..........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies...
Fetching gem metadata from https://rubygems.org/.........
Fetching public_suffix 4.0.6
Installing public_suffix 4.0.6
Fetching addressable 2.8.0
Installing addressable 2.8.0
Using bundler 2.1.4
Fetching colorator 1.1.0
Installing colorator 1.1.0
Fetching concurrent-ruby 1.1.9
Installing concurrent-ruby 1.1.9
Fetching eventmachine 1.2.7
Installing eventmachine 1.2.7 with native extensions
Fetching http_parser.rb 0.8.0
Installing http_parser.rb 0.8.0 with native extensions
Fetching em-websocket 0.5.3
Installing em-websocket 0.5.3
Fetching ffi 1.15.5
Installing ffi 1.15.5 with native extensions
Fetching forwardable-extended 2.6.0
Installing forwardable-extended 2.6.0
Fetching i18n 0.9.5
Installing i18n 0.9.5
Fetching rb-fsevent 0.11.1
Installing rb-fsevent 0.11.1
Fetching rb-inotify 0.10.1
Installing rb-inotify 0.10.1
Fetching sass-listen 4.0.0
Installing sass-listen 4.0.0
Fetching sass 3.7.4
Installing sass 3.7.4
Fetching jekyll-sass-converter 1.5.2
Installing jekyll-sass-converter 1.5.2
Fetching listen 3.7.1
Installing listen 3.7.1
Fetching jekyll-watch 2.2.1
Installing jekyll-watch 2.2.1
Fetching rexml 3.2.5
Installing rexml 3.2.5
Fetching kramdown 2.3.1
Installing kramdown 2.3.1
Fetching liquid 4.0.3
Installing liquid 4.0.3
Fetching mercenary 0.3.6
Installing mercenary 0.3.6
Fetching pathutil 0.16.2
Installing pathutil 0.16.2
Fetching rouge 3.28.0
Installing rouge 3.28.0
Fetching safe_yaml 1.0.5
Installing safe_yaml 1.0.5
Fetching jekyll 3.9.0
Installing jekyll 3.9.0

└─▪ bundle exec jekyll new --force --skip-bundle .
New jekyll site installed in /home/stav/Work/KingBot/kingbot/docs.
Bundle install skipped.

└─▪ bundle install
Fetching gem metadata from https://rubygems.org/..........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies...
Using public_suffix 4.0.6
Using addressable 2.8.0
Using bundler 2.1.4
Using colorator 1.1.0
Using concurrent-ruby 1.1.9
Using eventmachine 1.2.7
Using http_parser.rb 0.8.0
Using em-websocket 0.5.3
Using ffi 1.15.5
Using forwardable-extended 2.6.0
Using i18n 0.9.5
Using rb-fsevent 0.11.1
Using rb-inotify 0.10.1
Using sass-listen 4.0.0
Using sass 3.7.4
Using jekyll-sass-converter 1.5.2
Using listen 3.7.1
Using jekyll-watch 2.2.1
Using rexml 3.2.5
Using kramdown 2.3.1
Using liquid 4.0.3
Using mercenary 0.3.6
Using pathutil 0.16.2
Using rouge 3.28.0
Using safe_yaml 1.0.5
Using jekyll 3.9.0
Fetching jekyll-feed 0.16.0
Installing jekyll-feed 0.16.0
Fetching jekyll-seo-tag 2.8.0
Installing jekyll-seo-tag 2.8.0
Fetching kramdown-parser-gfm 1.1.0
Installing kramdown-parser-gfm 1.1.0
Fetching minima 2.5.1
Installing minima 2.5.1
Bundle complete! 7 Gemfile dependencies, 30 gems now installed.
Bundled gems are installed into `./vendor/bundle`
