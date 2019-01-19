#!/usr/bin/env bash

event="$1"
apikey="$2"
info=$(curl --silent -H "X-TBA-App-Id: frc4828:insight:v1.0.0" -H "X-TBA-Auth-Key: $apikey" https://www.thebluealliance.com/api/v3/event/$event | jq 'with_entries(select(.key == "name" or .key == "key"))')
matches=$(curl --silent -H "X-TBA-App-Id: frc4828:insight:v1.0.0" -H "X-TBA-Auth-Key: $apikey" https://www.thebluealliance.com/api/v2/event/$event/matches | jq '. | map(select(.alliances.blue.teams[0]=="frc4828", .alliances.blue.teams[1]=="frc4828", .alliances.blue.teams[2]=="frc4828", .alliances.red.teams[0]=="frc4828", .alliances.red.teams[1]=="frc4828", .alliances.red.teams[2]=="frc4828"))' | jq -s '. | sort_by("match_number")' | jq '.[0]' | jq 'sort_by(.time)')

jq -n --argjson matches "$matches" --argjson info "$info" "$info + {matches: $matches}"