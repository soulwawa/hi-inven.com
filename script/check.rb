#!/usr/bin/env ruby

require "json"
require "pathname"
require "uri"
require "yaml"

ROOT = Pathname(__dir__).join("..").expand_path
POLICIES = {
  "hi-inven-dev.json" => "dev",
  "hi-inven-testflight.json" => "testflight",
  "hi-inven.json" => "production"
}.freeze
SEMVER = /\A\d+\.\d+\.\d+\z/

def check(condition, message)
  abort "FAIL: #{message}" unless condition
end

def version(value)
  check(value.is_a?(String) && SEMVER.match?(value), "invalid version: #{value.inspect}")
  value.split(".").map(&:to_i)
end

POLICIES.each do |file, channel|
  policy = JSON.parse(ROOT.join(file).read)
  check(policy["schemaVersion"] == 1, "#{file} schemaVersion")
  check(policy["channel"] == channel, "#{file} channel")

  minimum = version(policy["minimumVersion"])
  recommended = version(policy["recommendedVersion"])
  check((recommended <=> minimum) >= 0, "#{file} recommendedVersion must be >= minimumVersion")

  active = minimum != [0, 0, 0] || recommended != [0, 0, 0]
  next unless active

  uri = URI.parse(policy["appStoreURL"].to_s)
  check(uri.is_a?(URI::HTTPS) && uri.host == "apps.apple.com", "#{file} needs an App Store URL")
end

ruby_options = RUBY_VERSION.start_with?("4.") ? { "RUBYOPT" => "-r#{ROOT.join('script/ruby4_compat.rb')}" } : {}
check(system(ruby_options, "bundle", "exec", "jekyll", "build", chdir: ROOT.to_s), "Jekyll build")

%w[index.html privacy/index.html support/index.html blog/index.html release/index.html].each do |file|
  check(ROOT.join("_site", file).file?, "missing built page: #{file}")
end

POLICIES.each_key do |file|
  check(JSON.parse(ROOT.join("_site", file).read) == JSON.parse(ROOT.join(file).read), "built policy differs: #{file}")
end

measurement_id = YAML.safe_load(ROOT.join("_config.yml").read)["ga4_measurement_id"]
check(measurement_id.nil? || /\AG-[A-Z0-9]{10}\z/.match?(measurement_id), "valid analytics ID or removed setting")
Dir.glob(ROOT.join("_site", "**", "*.html")).each do |file|
  html = File.read(file)
  check(html.scan('id="site-analytics"').length == (measurement_id ? 1 : 0), "analytics include count: #{file}")
  check(html.include?(%Q(data-measurement-id="#{measurement_id}")), "configured analytics ID: #{file}") if measurement_id
end
check(ROOT.join("_site/assets/js/analytics.js").read == ROOT.join("assets/js/analytics.js").read, "built analytics script differs")

puts "PASS: policies, Jekyll output and single analytics include"
