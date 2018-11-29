#!/bin/sh
pass=true
RED='\033[1;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Running Linters:"

# Run tslint and get the output and return code
tslint=$(webapp/node_modules/tslint/bin/tslint --project webapp -c webapp/tslint.test.json)
ret_code=$?

# If it didn't pass, announce it failed and print the output
if [ $ret_code != 0 ]; then
    printf "\n${RED}tslint failed:${NC}"
    echo "$tslint\n"
    pass=false
else
    printf "${GREEN}tslint passed.${NC}\n"
fi

# If there were no failures, it is good to commit
if $pass; then
    exit 0
fi

exit 1