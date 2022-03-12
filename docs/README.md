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

└─▪ gem install jekyll-theme-cayman
Fetching addressable-2.8.0.gem
Fetching colorator-1.1.0.gem
Fetching eventmachine-1.2.7.gem
Fetching http_parser.rb-0.8.0.gem
Fetching em-websocket-0.5.3.gem
Fetching concurrent-ruby-1.1.9.gem
Fetching public_suffix-4.0.6.gem
Fetching i18n-1.10.0.gem
Fetching ffi-1.15.5.gem
Fetching sassc-2.4.0.gem
Fetching jekyll-sass-converter-2.2.0.gem
Fetching rb-inotify-0.10.1.gem
Fetching listen-3.7.1.gem
Fetching jekyll-watch-2.2.1.gem
Fetching kramdown-2.3.1.gem
Fetching rb-fsevent-0.11.1.gem
Fetching mercenary-0.4.0.gem
Fetching kramdown-parser-gfm-1.1.0.gem
Fetching liquid-4.0.3.gem
Fetching forwardable-extended-2.6.0.gem
Fetching pathutil-0.16.2.gem
Fetching rouge-3.28.0.gem
Fetching safe_yaml-1.0.5.gem
Fetching unicode-display_width-1.8.0.gem
Fetching terminal-table-2.0.0.gem
Fetching jekyll-theme-cayman-0.2.0.gem
Fetching jekyll-4.2.2.gem
Fetching jekyll-seo-tag-2.8.0.gem
Successfully installed public_suffix-4.0.6
Successfully installed addressable-2.8.0
Successfully installed colorator-1.1.0
Building native extensions. This could take a while...
Successfully installed eventmachine-1.2.7
Building native extensions. This could take a while...
Successfully installed http_parser.rb-0.8.0
Successfully installed em-websocket-0.5.3
Successfully installed concurrent-ruby-1.1.9
Successfully installed i18n-1.10.0
Building native extensions. This could take a while...
Successfully installed ffi-1.15.5
Building native extensions. This could take a while...
Successfully installed sassc-2.4.0
Successfully installed jekyll-sass-converter-2.2.0
Successfully installed rb-fsevent-0.11.1
Successfully installed rb-inotify-0.10.1
Successfully installed listen-3.7.1
Successfully installed jekyll-watch-2.2.1
Successfully installed kramdown-2.3.1
Successfully installed kramdown-parser-gfm-1.1.0
Successfully installed liquid-4.0.3
Successfully installed mercenary-0.4.0
Successfully installed forwardable-extended-2.6.0
Successfully installed pathutil-0.16.2
Successfully installed rouge-3.28.0
Successfully installed safe_yaml-1.0.5
Successfully installed unicode-display_width-1.8.0
Successfully installed terminal-table-2.0.0
Successfully installed jekyll-4.2.2
Successfully installed jekyll-seo-tag-2.8.0
Successfully installed jekyll-theme-cayman-0.2.0
Parsing documentation for public_suffix-4.0.6
Installing ri documentation for public_suffix-4.0.6
Parsing documentation for addressable-2.8.0
Installing ri documentation for addressable-2.8.0
Parsing documentation for colorator-1.1.0
Installing ri documentation for colorator-1.1.0
Parsing documentation for eventmachine-1.2.7
Installing ri documentation for eventmachine-1.2.7
Parsing documentation for http_parser.rb-0.8.0
unknown encoding name "chunked\r\n\r\n25" for ext/ruby_http_parser/vendor/http-parser-java/tools/parse_tests.rb, skipping
Installing ri documentation for http_parser.rb-0.8.0
Parsing documentation for em-websocket-0.5.3
Installing ri documentation for em-websocket-0.5.3
Parsing documentation for concurrent-ruby-1.1.9
Installing ri documentation for concurrent-ruby-1.1.9
Parsing documentation for i18n-1.10.0
Installing ri documentation for i18n-1.10.0
Parsing documentation for ffi-1.15.5
Installing ri documentation for ffi-1.15.5
Parsing documentation for sassc-2.4.0
Installing ri documentation for sassc-2.4.0
Parsing documentation for jekyll-sass-converter-2.2.0
Installing ri documentation for jekyll-sass-converter-2.2.0
Parsing documentation for rb-fsevent-0.11.1
Installing ri documentation for rb-fsevent-0.11.1
Parsing documentation for rb-inotify-0.10.1
Installing ri documentation for rb-inotify-0.10.1
Parsing documentation for listen-3.7.1
Installing ri documentation for listen-3.7.1
Parsing documentation for jekyll-watch-2.2.1
Installing ri documentation for jekyll-watch-2.2.1
Parsing documentation for kramdown-2.3.1
Installing ri documentation for kramdown-2.3.1
Parsing documentation for kramdown-parser-gfm-1.1.0
Installing ri documentation for kramdown-parser-gfm-1.1.0
Parsing documentation for liquid-4.0.3
Installing ri documentation for liquid-4.0.3
Parsing documentation for mercenary-0.4.0
Installing ri documentation for mercenary-0.4.0
Parsing documentation for forwardable-extended-2.6.0
Installing ri documentation for forwardable-extended-2.6.0
Parsing documentation for pathutil-0.16.2
Installing ri documentation for pathutil-0.16.2
Parsing documentation for rouge-3.28.0
Installing ri documentation for rouge-3.28.0
Parsing documentation for safe_yaml-1.0.5
Installing ri documentation for safe_yaml-1.0.5
Parsing documentation for unicode-display_width-1.8.0
Installing ri documentation for unicode-display_width-1.8.0
Parsing documentation for terminal-table-2.0.0
Installing ri documentation for terminal-table-2.0.0
Parsing documentation for jekyll-4.2.2
Installing ri documentation for jekyll-4.2.2
Parsing documentation for jekyll-seo-tag-2.8.0
Installing ri documentation for jekyll-seo-tag-2.8.0
Parsing documentation for jekyll-theme-cayman-0.2.0
Installing ri documentation for jekyll-theme-cayman-0.2.0
Done installing documentation for public_suffix, addressable, colorator, eventmachine, http_parser.rb, em-websocket, concurrent-ruby, i18n, ffi, sassc, jekyll-sass-converter, rb-fsevent, rb-inotify, listen, jekyll-watch, kramdown, kramdown-parser-gfm, liquid, mercenary, forwardable-extended, pathutil, rouge, safe_yaml, unicode-display_width, terminal-table, jekyll, jekyll-seo-tag, jekyll-theme-cayman after 12 seconds
28 gems installed

└─▪ bundle add jekyll-theme-cayman
Fetching gem metadata from https://rubygems.org/..........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies...
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
Using jekyll-feed 0.16.0
Using jekyll-seo-tag 2.8.0
Fetching jekyll-theme-cayman 0.2.0
Installing jekyll-theme-cayman 0.2.0
Using kramdown-parser-gfm 1.1.0
Using minima 2.5.1

└─▪ bundle remove minima
Removing gems from /home/stav/Work/KingBot/kingbot/docs/Gemfile
minima (~> 2.0) was removed.

└─▪ bundle install
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
Using jekyll-feed 0.16.0
Using jekyll-seo-tag 2.8.0
Using jekyll-theme-cayman 0.2.0
Using kramdown-parser-gfm 1.1.0
Bundle complete! 7 Gemfile dependencies, 30 gems now installed.
Bundled gems are installed into `./vendor/bundle`

└─▪ gem install github-pages
Fetching rouge-3.26.0.gem
Fetching mercenary-0.3.6.gem
Fetching sass-listen-4.0.0.gem
Fetching sass-3.7.4.gem
Fetching jekyll-3.9.0.gem
Fetching jekyll-sass-converter-1.5.2.gem
Fetching i18n-0.9.5.gem
Fetching commonmarker-0.23.4.gem
Fetching jekyll-commonmark-1.4.0.gem
Fetching jekyll-commonmark-ghpages-0.2.0.gem
Fetching unf_ext-0.0.8.gem
Fetching unf-0.1.4.gem
Fetching simpleidn-0.2.1.gem
Fetching dnsruby-1.61.9.gem
Fetching ruby2_keywords-0.0.5.gem
Fetching faraday-em_http-1.0.0.gem
Fetching faraday-em_synchrony-1.0.0.gem
Fetching faraday-excon-1.1.0.gem
Fetching faraday-httpclient-1.0.1.gem
Fetching multipart-post-2.1.1.gem
Fetching faraday-multipart-1.0.3.gem
Fetching faraday-net_http-1.0.1.gem
Fetching faraday-net_http_persistent-1.2.0.gem
Fetching faraday-patron-1.0.0.gem
Fetching faraday-rack-1.0.0.gem
Fetching faraday-retry-1.0.3.gem
Fetching faraday-1.10.0.gem
Fetching sawyer-0.8.2.gem
Fetching octokit-4.22.0.gem
Fetching ethon-0.15.0.gem
Fetching typhoeus-1.4.0.gem
Fetching github-pages-health-check-1.17.9.gem
Fetching jekyll-redirect-from-0.16.0.gem
Fetching jekyll-sitemap-1.4.0.gem
Fetching jekyll-feed-0.15.1.gem
Fetching jekyll-gist-1.5.0.gem
Fetching jekyll-paginate-1.1.0.gem
Fetching coffee-script-source-1.11.1.gem
Fetching execjs-2.8.1.gem
Fetching coffee-script-2.4.1.gem
Fetching jekyll-coffeescript-1.1.1.gem
Fetching jekyll-github-metadata-2.13.0.gem
Fetching jekyll-avatar-0.7.0.gem
Fetching rubyzip-2.3.2.gem
Fetching jekyll-remote-theme-0.4.3.gem
Fetching jekyll-include-cache-0.2.1.gem
Fetching gemoji-3.0.1.gem
Fetching thread_safe-0.3.6.gem
Fetching tzinfo-1.2.9.gem
Fetching zeitwerk-2.5.4.gem
Fetching activesupport-6.0.4.7.gem
Fetching nokogiri-1.13.3-x86_64-linux.gem
Fetching html-pipeline-2.14.0.gem
Fetching jemoji-0.12.0.gem
Fetching jekyll-mentions-1.6.0.gem
Fetching jekyll-relative-links-0.6.1.gem
Fetching jekyll-optional-front-matter-0.3.2.gem
Fetching jekyll-readme-index-0.3.0.gem
Fetching jekyll-default-layout-0.1.4.gem
Fetching jekyll-titles-from-headings-0.5.3.gem
Fetching minima-2.5.1.gem
Fetching jekyll-swiss-1.0.0.gem
Fetching jekyll-theme-primer-0.6.0.gem
Fetching jekyll-theme-architect-0.2.0.gem
Fetching jekyll-theme-midnight-0.2.0.gem
Fetching jekyll-theme-dinky-0.2.0.gem
Fetching jekyll-theme-hacker-0.2.0.gem
Fetching jekyll-theme-leap-day-0.2.0.gem
Fetching jekyll-theme-merlot-0.2.0.gem
Fetching jekyll-theme-minimal-0.2.0.gem
Fetching jekyll-theme-modernist-0.2.0.gem
Fetching jekyll-theme-slate-0.2.0.gem
Fetching github-pages-225.gem
Fetching jekyll-theme-tactile-0.2.0.gem
Fetching jekyll-theme-time-machine-0.2.0.gem
Fetching terminal-table-1.8.0.gem
Successfully installed rouge-3.26.0
Successfully installed mercenary-0.3.6
Successfully installed sass-listen-4.0.0

Ruby Sass has reached end-of-life and should no longer be used.

* If you use Sass as a command-line tool, we recommend using Dart Sass, the new
  primary implementation: https://sass-lang.com/install

* If you use Sass as a plug-in for a Ruby web framework, we recommend using the
  sassc gem: https://github.com/sass/sassc-ruby#readme

* For more details, please refer to the Sass blog:
  https://sass-lang.com/blog/posts/7828841

Successfully installed sass-3.7.4
Successfully installed jekyll-sass-converter-1.5.2
Successfully installed i18n-0.9.5
Successfully installed jekyll-3.9.0
Building native extensions. This could take a while...
Successfully installed commonmarker-0.23.4
Successfully installed jekyll-commonmark-1.4.0
Successfully installed jekyll-commonmark-ghpages-0.2.0
Building native extensions. This could take a while...
Successfully installed unf_ext-0.0.8
Successfully installed unf-0.1.4
Successfully installed simpleidn-0.2.1
Installing dnsruby...
  For issues and source code: https://github.com/alexdalitz/dnsruby
  For general discussion (please tell us how you use dnsruby): https://groups.google.com/forum/#!forum/dnsruby
Successfully installed dnsruby-1.61.9
Successfully installed ruby2_keywords-0.0.5
Successfully installed faraday-em_http-1.0.0
Successfully installed faraday-em_synchrony-1.0.0
Successfully installed faraday-excon-1.1.0
Successfully installed faraday-httpclient-1.0.1
Successfully installed multipart-post-2.1.1
Successfully installed faraday-multipart-1.0.3
Successfully installed faraday-net_http-1.0.1
Successfully installed faraday-net_http_persistent-1.2.0
Successfully installed faraday-patron-1.0.0
Successfully installed faraday-rack-1.0.0
Successfully installed faraday-retry-1.0.3
Successfully installed faraday-1.10.0
Successfully installed sawyer-0.8.2
Successfully installed octokit-4.22.0
Successfully installed ethon-0.15.0
Successfully installed typhoeus-1.4.0
Successfully installed github-pages-health-check-1.17.9
Successfully installed jekyll-redirect-from-0.16.0
Successfully installed jekyll-sitemap-1.4.0
Successfully installed jekyll-feed-0.15.1
Successfully installed jekyll-gist-1.5.0
Successfully installed jekyll-paginate-1.1.0
Successfully installed coffee-script-source-1.11.1
Successfully installed execjs-2.8.1
Successfully installed coffee-script-2.4.1
Successfully installed jekyll-coffeescript-1.1.1
Successfully installed jekyll-github-metadata-2.13.0
Successfully installed jekyll-avatar-0.7.0
RubyZip 3.0 is coming!
**********************

The public API of some Rubyzip classes has been modernized to use named
parameters for optional arguments. Please check your usage of the
following classes:
  * `Zip::File`
  * `Zip::Entry`
  * `Zip::InputStream`
  * `Zip::OutputStream`

Please ensure that your Gemfiles and .gemspecs are suitably restrictive
to avoid an unexpected breakage when 3.0 is released (e.g. ~> 2.3.0).
See https://github.com/rubyzip/rubyzip for details. The Changelog also
lists other enhancements and bugfixes that have been implemented since
version 2.3.0.
Successfully installed rubyzip-2.3.2
Successfully installed jekyll-remote-theme-0.4.3
Successfully installed jekyll-include-cache-0.2.1
Successfully installed gemoji-3.0.1
Successfully installed thread_safe-0.3.6
Successfully installed tzinfo-1.2.9
Successfully installed zeitwerk-2.5.4
Successfully installed activesupport-6.0.4.7
Successfully installed nokogiri-1.13.3-x86_64-linux
-------------------------------------------------
Thank you for installing html-pipeline!
You must bundle Filter gem dependencies.
See html-pipeline README.md for more details.
https://github.com/jch/html-pipeline#dependencies
-------------------------------------------------
Successfully installed html-pipeline-2.14.0
Successfully installed jemoji-0.12.0
Successfully installed jekyll-mentions-1.6.0
Successfully installed jekyll-relative-links-0.6.1
Successfully installed jekyll-optional-front-matter-0.3.2
Successfully installed jekyll-readme-index-0.3.0
Successfully installed jekyll-default-layout-0.1.4
Successfully installed jekyll-titles-from-headings-0.5.3
Successfully installed minima-2.5.1
Successfully installed jekyll-swiss-1.0.0
Successfully installed jekyll-theme-primer-0.6.0
Successfully installed jekyll-theme-architect-0.2.0
Successfully installed jekyll-theme-dinky-0.2.0
Successfully installed jekyll-theme-hacker-0.2.0
Successfully installed jekyll-theme-leap-day-0.2.0
Successfully installed jekyll-theme-merlot-0.2.0
Successfully installed jekyll-theme-midnight-0.2.0
Successfully installed jekyll-theme-minimal-0.2.0
Successfully installed jekyll-theme-modernist-0.2.0
Successfully installed jekyll-theme-slate-0.2.0
Successfully installed jekyll-theme-tactile-0.2.0
Successfully installed jekyll-theme-time-machine-0.2.0
Successfully installed terminal-table-1.8.0
Successfully installed github-pages-225
Parsing documentation for rouge-3.26.0
Installing ri documentation for rouge-3.26.0
Parsing documentation for mercenary-0.3.6
Installing ri documentation for mercenary-0.3.6
Parsing documentation for sass-listen-4.0.0
Installing ri documentation for sass-listen-4.0.0
Parsing documentation for sass-3.7.4
Installing ri documentation for sass-3.7.4
Parsing documentation for jekyll-sass-converter-1.5.2
Installing ri documentation for jekyll-sass-converter-1.5.2
Parsing documentation for i18n-0.9.5
Installing ri documentation for i18n-0.9.5
Parsing documentation for jekyll-3.9.0
Installing ri documentation for jekyll-3.9.0
Parsing documentation for commonmarker-0.23.4
Installing ri documentation for commonmarker-0.23.4
Parsing documentation for jekyll-commonmark-1.4.0
Installing ri documentation for jekyll-commonmark-1.4.0
Parsing documentation for jekyll-commonmark-ghpages-0.2.0
Installing ri documentation for jekyll-commonmark-ghpages-0.2.0
Parsing documentation for unf_ext-0.0.8
Installing ri documentation for unf_ext-0.0.8
Parsing documentation for unf-0.1.4
Installing ri documentation for unf-0.1.4
Parsing documentation for simpleidn-0.2.1
Installing ri documentation for simpleidn-0.2.1
Parsing documentation for dnsruby-1.61.9
Installing ri documentation for dnsruby-1.61.9
Parsing documentation for ruby2_keywords-0.0.5
Installing ri documentation for ruby2_keywords-0.0.5
Parsing documentation for faraday-em_http-1.0.0
Installing ri documentation for faraday-em_http-1.0.0
Parsing documentation for faraday-em_synchrony-1.0.0
Installing ri documentation for faraday-em_synchrony-1.0.0
Parsing documentation for faraday-excon-1.1.0
Installing ri documentation for faraday-excon-1.1.0
Parsing documentation for faraday-httpclient-1.0.1
Installing ri documentation for faraday-httpclient-1.0.1
Parsing documentation for multipart-post-2.1.1
Installing ri documentation for multipart-post-2.1.1
Parsing documentation for faraday-multipart-1.0.3
Installing ri documentation for faraday-multipart-1.0.3
Parsing documentation for faraday-net_http-1.0.1
Installing ri documentation for faraday-net_http-1.0.1
Parsing documentation for faraday-net_http_persistent-1.2.0
Installing ri documentation for faraday-net_http_persistent-1.2.0
Parsing documentation for faraday-patron-1.0.0
Installing ri documentation for faraday-patron-1.0.0
Parsing documentation for faraday-rack-1.0.0
Installing ri documentation for faraday-rack-1.0.0
Parsing documentation for faraday-retry-1.0.3
Installing ri documentation for faraday-retry-1.0.3
Parsing documentation for faraday-1.10.0
Installing ri documentation for faraday-1.10.0
Parsing documentation for sawyer-0.8.2
Installing ri documentation for sawyer-0.8.2
Parsing documentation for octokit-4.22.0
Installing ri documentation for octokit-4.22.0
Parsing documentation for ethon-0.15.0
Installing ri documentation for ethon-0.15.0
Parsing documentation for typhoeus-1.4.0
Installing ri documentation for typhoeus-1.4.0
Parsing documentation for github-pages-health-check-1.17.9
Installing ri documentation for github-pages-health-check-1.17.9
Parsing documentation for jekyll-redirect-from-0.16.0
Installing ri documentation for jekyll-redirect-from-0.16.0
Parsing documentation for jekyll-sitemap-1.4.0
Installing ri documentation for jekyll-sitemap-1.4.0
Parsing documentation for jekyll-feed-0.15.1
Installing ri documentation for jekyll-feed-0.15.1
Parsing documentation for jekyll-gist-1.5.0
Installing ri documentation for jekyll-gist-1.5.0
Parsing documentation for jekyll-paginate-1.1.0
Installing ri documentation for jekyll-paginate-1.1.0
Parsing documentation for coffee-script-source-1.11.1
Installing ri documentation for coffee-script-source-1.11.1
Parsing documentation for execjs-2.8.1
Installing ri documentation for execjs-2.8.1
Parsing documentation for coffee-script-2.4.1
Installing ri documentation for coffee-script-2.4.1
Parsing documentation for jekyll-coffeescript-1.1.1
Installing ri documentation for jekyll-coffeescript-1.1.1
Parsing documentation for jekyll-github-metadata-2.13.0
Installing ri documentation for jekyll-github-metadata-2.13.0
Parsing documentation for jekyll-avatar-0.7.0
Installing ri documentation for jekyll-avatar-0.7.0
Parsing documentation for rubyzip-2.3.2
Installing ri documentation for rubyzip-2.3.2
Parsing documentation for jekyll-remote-theme-0.4.3
Installing ri documentation for jekyll-remote-theme-0.4.3
Parsing documentation for jekyll-include-cache-0.2.1
Installing ri documentation for jekyll-include-cache-0.2.1
Parsing documentation for gemoji-3.0.1
Installing ri documentation for gemoji-3.0.1
Parsing documentation for thread_safe-0.3.6
Installing ri documentation for thread_safe-0.3.6
Parsing documentation for tzinfo-1.2.9
Installing ri documentation for tzinfo-1.2.9
Parsing documentation for zeitwerk-2.5.4
Installing ri documentation for zeitwerk-2.5.4
Parsing documentation for activesupport-6.0.4.7
Installing ri documentation for activesupport-6.0.4.7
Parsing documentation for nokogiri-1.13.3-x86_64-linux
Installing ri documentation for nokogiri-1.13.3-x86_64-linux
Parsing documentation for html-pipeline-2.14.0
Installing ri documentation for html-pipeline-2.14.0
Parsing documentation for jemoji-0.12.0
Installing ri documentation for jemoji-0.12.0
Parsing documentation for jekyll-mentions-1.6.0
Installing ri documentation for jekyll-mentions-1.6.0
Parsing documentation for jekyll-relative-links-0.6.1
Installing ri documentation for jekyll-relative-links-0.6.1
Parsing documentation for jekyll-optional-front-matter-0.3.2
Installing ri documentation for jekyll-optional-front-matter-0.3.2
Parsing documentation for jekyll-readme-index-0.3.0
Installing ri documentation for jekyll-readme-index-0.3.0
Parsing documentation for jekyll-default-layout-0.1.4
Installing ri documentation for jekyll-default-layout-0.1.4
Parsing documentation for jekyll-titles-from-headings-0.5.3
Installing ri documentation for jekyll-titles-from-headings-0.5.3
Parsing documentation for minima-2.5.1
Installing ri documentation for minima-2.5.1
Parsing documentation for jekyll-swiss-1.0.0
Installing ri documentation for jekyll-swiss-1.0.0
Parsing documentation for jekyll-theme-primer-0.6.0
Installing ri documentation for jekyll-theme-primer-0.6.0
Parsing documentation for jekyll-theme-architect-0.2.0
Installing ri documentation for jekyll-theme-architect-0.2.0
Parsing documentation for jekyll-theme-dinky-0.2.0
Installing ri documentation for jekyll-theme-dinky-0.2.0
Parsing documentation for jekyll-theme-hacker-0.2.0
Installing ri documentation for jekyll-theme-hacker-0.2.0
Parsing documentation for jekyll-theme-leap-day-0.2.0
Installing ri documentation for jekyll-theme-leap-day-0.2.0
Parsing documentation for jekyll-theme-merlot-0.2.0
Installing ri documentation for jekyll-theme-merlot-0.2.0
Parsing documentation for jekyll-theme-midnight-0.2.0
Installing ri documentation for jekyll-theme-midnight-0.2.0
Parsing documentation for jekyll-theme-minimal-0.2.0
Installing ri documentation for jekyll-theme-minimal-0.2.0
Parsing documentation for jekyll-theme-modernist-0.2.0
Installing ri documentation for jekyll-theme-modernist-0.2.0
Parsing documentation for jekyll-theme-slate-0.2.0
Installing ri documentation for jekyll-theme-slate-0.2.0
Parsing documentation for jekyll-theme-tactile-0.2.0
Installing ri documentation for jekyll-theme-tactile-0.2.0
Parsing documentation for jekyll-theme-time-machine-0.2.0
Installing ri documentation for jekyll-theme-time-machine-0.2.0
Parsing documentation for terminal-table-1.8.0
Installing ri documentation for terminal-table-1.8.0
Parsing documentation for github-pages-225
Installing ri documentation for github-pages-225
Done installing documentation for rouge, mercenary, sass-listen, sass, jekyll-sass-converter, i18n, jekyll, commonmarker, jekyll-commonmark, jekyll-commonmark-ghpages, unf_ext, unf, simpleidn, dnsruby, ruby2_keywords, faraday-em_http, faraday-em_synchrony, faraday-excon, faraday-httpclient, multipart-post, faraday-multipart, faraday-net_http, faraday-net_http_persistent, faraday-patron, faraday-rack, faraday-retry, faraday, sawyer, octokit, ethon, typhoeus, github-pages-health-check, jekyll-redirect-from, jekyll-sitemap, jekyll-feed, jekyll-gist, jekyll-paginate, coffee-script-source, execjs, coffee-script, jekyll-coffeescript, jekyll-github-metadata, jekyll-avatar, rubyzip, jekyll-remote-theme, jekyll-include-cache, gemoji, thread_safe, tzinfo, zeitwerk, activesupport, nokogiri, html-pipeline, jemoji, jekyll-mentions, jekyll-relative-links, jekyll-optional-front-matter, jekyll-readme-index, jekyll-default-layout, jekyll-titles-from-headings, minima, jekyll-swiss, jekyll-theme-primer, jekyll-theme-architect, jekyll-theme-dinky, jekyll-theme-hacker, jekyll-theme-leap-day, jekyll-theme-merlot, jekyll-theme-midnight, jekyll-theme-minimal, jekyll-theme-modernist, jekyll-theme-slate, jekyll-theme-tactile, jekyll-theme-time-machine, terminal-table, github-pages after 11 seconds
76 gems installed

└─▪ bundle update
Fetching gem metadata from https://rubygems.org/...........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies....
Using concurrent-ruby 1.1.9
Using i18n 0.9.5
Fetching minitest 5.15.0
Installing minitest 5.15.0
Fetching thread_safe 0.3.6
Installing thread_safe 0.3.6
Fetching tzinfo 1.2.9
Installing tzinfo 1.2.9
Fetching zeitwerk 2.5.4
Installing zeitwerk 2.5.4
Fetching activesupport 6.0.4.7
Installing activesupport 6.0.4.7
Using public_suffix 4.0.6
Using addressable 2.8.0
Using bundler 2.1.4
Fetching coffee-script-source 1.11.1
Installing coffee-script-source 1.11.1
Fetching execjs 2.8.1
Installing execjs 2.8.1
Fetching coffee-script 2.4.1
Installing coffee-script 2.4.1
Using colorator 1.1.0
Fetching commonmarker 0.23.4
Installing commonmarker 0.23.4 with native extensions
Fetching unf_ext 0.0.8
Installing unf_ext 0.0.8 with native extensions
Fetching unf 0.1.4
Installing unf 0.1.4
Fetching simpleidn 0.2.1
Installing simpleidn 0.2.1
Fetching dnsruby 1.61.9
Installing dnsruby 1.61.9
Using eventmachine 1.2.7
Using http_parser.rb 0.8.0
Using em-websocket 0.5.3
Using ffi 1.15.5
Fetching ethon 0.15.0
Installing ethon 0.15.0
Fetching faraday-em_http 1.0.0
Installing faraday-em_http 1.0.0
Fetching faraday-em_synchrony 1.0.0
Installing faraday-em_synchrony 1.0.0
Fetching faraday-excon 1.1.0
Installing faraday-excon 1.1.0
Fetching faraday-httpclient 1.0.1
Installing faraday-httpclient 1.0.1
Fetching multipart-post 2.1.1
Installing multipart-post 2.1.1
Fetching faraday-multipart 1.0.3
Installing faraday-multipart 1.0.3
Fetching faraday-net_http 1.0.1
Installing faraday-net_http 1.0.1
Fetching faraday-net_http_persistent 1.2.0
Installing faraday-net_http_persistent 1.2.0
Fetching faraday-patron 1.0.0
Installing faraday-patron 1.0.0
Fetching faraday-rack 1.0.0
Installing faraday-rack 1.0.0
Fetching faraday-retry 1.0.3
Installing faraday-retry 1.0.3
Fetching ruby2_keywords 0.0.5
Installing ruby2_keywords 0.0.5
Fetching faraday 1.10.0
Installing faraday 1.10.0
Using forwardable-extended 2.6.0
Fetching gemoji 3.0.1
Installing gemoji 3.0.1
Fetching sawyer 0.8.2
Installing sawyer 0.8.2
Fetching octokit 4.22.0
Installing octokit 4.22.0
Fetching typhoeus 1.4.0
Installing typhoeus 1.4.0
Fetching github-pages-health-check 1.17.9
Installing github-pages-health-check 1.17.9
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
Fetching rouge 3.26.0 (was 3.28.0)
Installing rouge 3.26.0 (was 3.28.0)
Using safe_yaml 1.0.5
Using jekyll 3.9.0
Fetching jekyll-avatar 0.7.0
Installing jekyll-avatar 0.7.0
Fetching jekyll-coffeescript 1.1.1
Installing jekyll-coffeescript 1.1.1
Fetching jekyll-commonmark 1.4.0
Installing jekyll-commonmark 1.4.0
Fetching jekyll-commonmark-ghpages 0.2.0
Installing jekyll-commonmark-ghpages 0.2.0
Fetching jekyll-default-layout 0.1.4
Installing jekyll-default-layout 0.1.4
Fetching jekyll-feed 0.15.1 (was 0.16.0)
Installing jekyll-feed 0.15.1 (was 0.16.0)
Fetching jekyll-gist 1.5.0
Installing jekyll-gist 1.5.0
Fetching jekyll-github-metadata 2.13.0
Installing jekyll-github-metadata 2.13.0
Fetching jekyll-include-cache 0.2.1
Installing jekyll-include-cache 0.2.1
Fetching mini_portile2 2.8.0
Installing mini_portile2 2.8.0
Fetching racc 1.6.0
Installing racc 1.6.0 with native extensions
Fetching nokogiri 1.13.3 (x86_64-linux)
Installing nokogiri 1.13.3 (x86_64-linux)
Fetching html-pipeline 2.14.0
Installing html-pipeline 2.14.0
Fetching jekyll-mentions 1.6.0
Installing jekyll-mentions 1.6.0
Fetching jekyll-optional-front-matter 0.3.2
Installing jekyll-optional-front-matter 0.3.2
Fetching jekyll-paginate 1.1.0
Installing jekyll-paginate 1.1.0
Fetching jekyll-readme-index 0.3.0
Installing jekyll-readme-index 0.3.0
Fetching jekyll-redirect-from 0.16.0
Installing jekyll-redirect-from 0.16.0
Fetching jekyll-relative-links 0.6.1
Installing jekyll-relative-links 0.6.1
Fetching rubyzip 2.3.2
Installing rubyzip 2.3.2
Fetching jekyll-remote-theme 0.4.3
Installing jekyll-remote-theme 0.4.3
Using jekyll-seo-tag 2.8.0
Fetching jekyll-sitemap 1.4.0
Installing jekyll-sitemap 1.4.0
Fetching jekyll-swiss 1.0.0
Installing jekyll-swiss 1.0.0
Fetching jekyll-theme-architect 0.2.0
Installing jekyll-theme-architect 0.2.0
Using jekyll-theme-cayman 0.2.0
Fetching jekyll-theme-dinky 0.2.0
Installing jekyll-theme-dinky 0.2.0
Fetching jekyll-theme-hacker 0.2.0
Installing jekyll-theme-hacker 0.2.0
Fetching jekyll-theme-leap-day 0.2.0
Installing jekyll-theme-leap-day 0.2.0
Fetching jekyll-theme-merlot 0.2.0
Installing jekyll-theme-merlot 0.2.0
Fetching jekyll-theme-midnight 0.2.0
Installing jekyll-theme-midnight 0.2.0
Fetching jekyll-theme-minimal 0.2.0
Installing jekyll-theme-minimal 0.2.0
Fetching jekyll-theme-modernist 0.2.0
Installing jekyll-theme-modernist 0.2.0
Fetching jekyll-theme-primer 0.6.0
Installing jekyll-theme-primer 0.6.0
Fetching jekyll-theme-slate 0.2.0
Installing jekyll-theme-slate 0.2.0
Fetching jekyll-theme-tactile 0.2.0
Installing jekyll-theme-tactile 0.2.0
Fetching jekyll-theme-time-machine 0.2.0
Installing jekyll-theme-time-machine 0.2.0
Fetching jekyll-titles-from-headings 0.5.3
Installing jekyll-titles-from-headings 0.5.3
Fetching jemoji 0.12.0
Installing jemoji 0.12.0
Using kramdown-parser-gfm 1.1.0
Using minima 2.5.1
Fetching unicode-display_width 1.8.0
Installing unicode-display_width 1.8.0
Fetching terminal-table 1.8.0
Installing terminal-table 1.8.0
Fetching github-pages 225
Installing github-pages 225
Bundle updated!
Post-install message from dnsruby:
Installing dnsruby...
  For issues and source code: https://github.com/alexdalitz/dnsruby
  For general discussion (please tell us how you use dnsruby): https://groups.google.com/forum/#!forum/dnsruby
Post-install message from html-pipeline:
-------------------------------------------------
Thank you for installing html-pipeline!
You must bundle Filter gem dependencies.
See html-pipeline README.md for more details.
https://github.com/jch/html-pipeline#dependencies
-------------------------------------------------
Post-install message from rubyzip:
RubyZip 3.0 is coming!
**********************

The public API of some Rubyzip classes has been modernized to use named
parameters for optional arguments. Please check your usage of the
following classes:
  * `Zip::File`
  * `Zip::Entry`
  * `Zip::InputStream`
  * `Zip::OutputStream`

Please ensure that your Gemfiles and .gemspecs are suitably restrictive
to avoid an unexpected breakage when 3.0 is released (e.g. ~> 2.3.0).
See https://github.com/rubyzip/rubyzip for details. The Changelog also
lists other enhancements and bugfixes that have been implemented since
version 2.3.0.

└─▪ bundle add github-pages
Fetching gem metadata from https://rubygems.org/.........
Using concurrent-ruby 1.1.9
Using i18n 0.9.5
Using minitest 5.15.0
Using thread_safe 0.3.6
Using tzinfo 1.2.9
Using zeitwerk 2.5.4
Using activesupport 6.0.4.7
Using public_suffix 4.0.6
Using addressable 2.8.0
Using bundler 2.1.4
Using coffee-script-source 1.11.1
Using execjs 2.8.1
Using coffee-script 2.4.1
Using colorator 1.1.0
Using commonmarker 0.23.4
Using unf_ext 0.0.8
Using unf 0.1.4
Using simpleidn 0.2.1
Using dnsruby 1.61.9
Using eventmachine 1.2.7
Using http_parser.rb 0.8.0
Using em-websocket 0.5.3
Using ffi 1.15.5
Using ethon 0.15.0
Using faraday-em_http 1.0.0
Using faraday-em_synchrony 1.0.0
Using faraday-excon 1.1.0
Using faraday-httpclient 1.0.1
Using multipart-post 2.1.1
Using faraday-multipart 1.0.3
Using faraday-net_http 1.0.1
Using faraday-net_http_persistent 1.2.0
Using faraday-patron 1.0.0
Using faraday-rack 1.0.0
Using faraday-retry 1.0.3
Using ruby2_keywords 0.0.5
Using faraday 1.10.0
Using forwardable-extended 2.6.0
Using gemoji 3.0.1
Using sawyer 0.8.2
Using octokit 4.22.0
Using typhoeus 1.4.0
Using github-pages-health-check 1.17.9
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
Using rouge 3.26.0
Using safe_yaml 1.0.5
Using jekyll 3.9.0
Using jekyll-avatar 0.7.0
Using jekyll-coffeescript 1.1.1
Using jekyll-commonmark 1.4.0
Using jekyll-commonmark-ghpages 0.2.0
Using jekyll-default-layout 0.1.4
Using jekyll-feed 0.15.1
Using jekyll-gist 1.5.0
Using jekyll-github-metadata 2.13.0
Using jekyll-include-cache 0.2.1
Using mini_portile2 2.8.0
Using racc 1.6.0
Using nokogiri 1.13.3 (x86_64-linux)
Using html-pipeline 2.14.0
Using jekyll-mentions 1.6.0
Using jekyll-optional-front-matter 0.3.2
Using jekyll-paginate 1.1.0
Using jekyll-readme-index 0.3.0
Using jekyll-redirect-from 0.16.0
Using jekyll-relative-links 0.6.1
Using rubyzip 2.3.2
Using jekyll-remote-theme 0.4.3
Using jekyll-seo-tag 2.8.0
Using jekyll-sitemap 1.4.0
Using jekyll-swiss 1.0.0
Using jekyll-theme-architect 0.2.0
Using jekyll-theme-cayman 0.2.0
Using jekyll-theme-dinky 0.2.0
Using jekyll-theme-hacker 0.2.0
Using jekyll-theme-leap-day 0.2.0
Using jekyll-theme-merlot 0.2.0
Using jekyll-theme-midnight 0.2.0
Using jekyll-theme-minimal 0.2.0
Using jekyll-theme-modernist 0.2.0
Using jekyll-theme-primer 0.6.0
Using jekyll-theme-slate 0.2.0
Using jekyll-theme-tactile 0.2.0
Using jekyll-theme-time-machine 0.2.0
Using jekyll-titles-from-headings 0.5.3
Using jemoji 0.12.0
Using kramdown-parser-gfm 1.1.0
Using minima 2.5.1
Using unicode-display_width 1.8.0
Using terminal-table 1.8.0
Using github-pages 225
