#!/bin/bash

NOW="$(date +'%Y-%m-%d')"
RED="\033[1;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
PURPLE="\033[1;35m"
CYAN="\033[1;36m"
WHITE="\033[1;37m"
RESET="\033[0m"

QUESTION_FLAG="${GREEN}?"
WARNING_FLAG="${YELLOW}!"
NOTICE_FLAG="${CYAN}❯"
ERROR_FLAG="${RED}ERROR:"
SUCCESS_FLAG="${GREEN}❯"
LOADING_FLAG="${CYAN}❖"

ADJUSTMENTS_MSG="${QUESTION_FLAG} ${CYAN}Now you can make adjustments to ${WHITE}CHANGELOG.md${CYAN}. Then press enter to continue."
RELEASE_MSG="${QUESTION_FLAG} ${CYAN}Do you want to create PR now?"
PUSHING_MSG="${NOTICE_FLAG} Pushing new version to the ${WHITE}origin${CYAN}..."

source .env

NEW_VERSION=""
CHANGELOG=""

# Bump new version (major.minor.patch), auto suggest to update "minor" version
bumpVersion() {
  if [ -f VERSION ]; then
    # Bump version
    BASE_STRING=$(cat VERSION)
    BASE_LIST=($(echo $BASE_STRING | tr '.' ' '))
    MAJOR=${BASE_LIST[0]}
    MINOR=${BASE_LIST[1]}
    PATCH=${BASE_LIST[2]}
    echo -e "${NOTICE_FLAG} Current version: ${WHITE}$BASE_STRING"
    MINOR=$((MINOR + 1))
    PATCH=0
    SUGGESTED_VERSION="$MAJOR.$MINOR.$PATCH"
    echo -ne "${QUESTION_FLAG} ${CYAN}Enter a version number [${WHITE}$SUGGESTED_VERSION${CYAN}]: "
    read INPUT_STRING
    if [ "$INPUT_STRING" = "" ]; then
      INPUT_STRING=$SUGGESTED_VERSION
    fi
    echo -e "${NOTICE_FLAG} Will set new version to be ${WHITE}$INPUT_STRING"
    NEW_VERSION=${INPUT_STRING}
  else
    echo -e "${WARNING_FLAG} Could not find a VERSION file."
    echo -ne "${QUESTION_FLAG} ${CYAN}Do you want to create a version file and start from scratch? [${WHITE}y${CYAN}]: "
    read RESPONSE
    if [ "$RESPONSE" = "" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "Y" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "Yes" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "yes" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "YES" ]; then RESPONSE="y"; fi
    if [ "$RESPONSE" = "y" ]; then
      NEW_VERSION="0.0.1"
    fi
  fi
}

fetchClickupTask() {
  URL="https://api.clickup.com/api/v1/team/${CLICKUP_TEAM_ID}/task?"

  HEADERS=(
    -H "Authorization: ${CLICKUP_TOKEN}"
  )

  for TASK_ID in $@; do
    URL+="task_ids=${TASK_ID}&"
  done

  curl -s "${HEADERS[@]}" -G "$URL"
}

# Fetch all clickup tasks in pull requests to update changelog file
clickupChangelog() {
  t=$(which jq)
  if [ -z "$t" ]; then
    echo "${LOADING_FLAG} ${CYAN}Installing jq ..."
    brew install jq
  fi

  # Fetching tasks
  CONTENT=$(git request-pull master ./ | grep -Eo 'cu-(\w*)' | grep -Eo '[^cu-]\w*')
  COMMITS=(${CONTENT//$'\n'/ })

  if [ ! -z "$COMMITS" ]; then
    echo -e "${LOADING_FLAG} ${CYAN}Fetching clickup tasks..."
    LINES=$(fetchClickupTask ${COMMITS[@]} | jq '.tasks[] | "CU-\(.id)[on-production] \(.name)"')
    echo -e "${SUCCESS_FLAG} ${GREEN}Fetch clickup tasks done!"
    CHANGELOG=$LINES

    if [[ ! -z "$CHANGELOG" ]]; then
      for CHANGE in "${CHANGELOG[@]}"; do
        echo "$CHANGE" | tr -d '"' >>tmpfile
      done
    fi
  else
    echo -e "${WARNING_FLAG} Not found clickup tasks in commits"
  fi
}

# -------------------#
# ----- Start ------ #

# Create a release branch if it doesn't exist
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" =~ ^release ]]; then
  echo -e "${NOTICE_FLAG} You are already on release branch: ${WHITE}${BRANCH}"
else
  BRANCH="release/$(date +'%Y%m%d')"
  echo -e "${WARNING_FLAG} Switch to new release branch: ${WHITE}${BRANCH}"
  git fetch >/dev/null 2>&1
  git checkout develop >/dev/null 2>&1
  git reset origin/develop --hard >/dev/null 2>&1
  git checkout -b "${BRANCH}" >/dev/null 2>&1
  echo -e "${NOTICE_FLAG} Your are on new branch: ${WHITE}${BRANCH}"
fi

# Bump next version
bumpVersion
if [ ! -z "$NEW_VERSION" ]; then
  # Update changelog
  echo "# Changelog for v$INPUT_STRING ($NOW)" >tmpfile
  echo "" >>tmpfile
  # Append clickup tasks to changelog if the click token has been configured
  if [ ! -z "$CLICKUP_TEAM_ID" ] && [ ! -z "$CLICKUP_TOKEN" ]; then
    clickupChangelog
  fi
  echo "" >>tmpfile
  PR_MSG=$(cat tmpfile)
  cat CHANGELOG.md >>tmpfile
  mv tmpfile CHANGELOG.md
  echo -e "$ADJUSTMENTS_MSG"
  read
  echo -e "$PUSHING_MSG"
  echo $INPUT_STRING >VERSION
  # Create build file
  cp -a src/ "chrome-djadmin-pro-$NEW_VERSION/"
  zip -r "./dist/chrome-djadmin-pro-$NEW_VERSION.zip" "./chrome-djadmin-pro-$NEW_VERSION"
  rm -r -f "chrome-djadmin-pro-$NEW_VERSION"
  # Commit + Pushing
  git add . >/dev/null 2>&1
  git commit -m "Bump version to ${INPUT_STRING}." >/dev/null 2>&1
  git tag -a -m "Tag version ${INPUT_STRING}." "v$INPUT_STRING" >/dev/null 2>&1
  git push origin "${BRANCH}" --tags >/dev/null 2>&1
  echo -e "${SUCCESS_FLAG} New version has been just pushed to ${WHITE}origin"
  echo -e "$RELEASE_MSG"
  read RESPONSE
  if [ "$RESPONSE" = "" ]; then RESPONSE="y"; fi
  if [ "$RESPONSE" = "Y" ]; then RESPONSE="y"; fi
  if [ "$RESPONSE" = "Yes" ]; then RESPONSE="y"; fi
  if [ "$RESPONSE" = "yes" ]; then RESPONSE="y"; fi
  if [ "$RESPONSE" = "YES" ]; then RESPONSE="y"; fi
  if [ "$RESPONSE" = "y" ]; then
    echo "$PR_MSG" >PR.md
    bash ./scripts/create_pr.sh
  else
    echo -e "${WARNING_FLAG} Skip to create PR."
  fi
  echo -e "${SUCCESS_FLAG} Finished."
else
  echo -e "${WARNING_FLAG} Bump version failed. Bye."
fi
