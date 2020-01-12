#!/usr/bin/env bash
# Run from project root!

getVersion() {
  cd ios && xcrun agvtool what-marketing-version && cd ..
}

getBuild() {
  cd ios && xcrun agvtool what-version && cd ..
}

setVersion() {
  cd ios && xcrun agvtool new-marketing-version $@ && cd .. && getVersion
}

bumpBuild() {
  cd ios && xcrun agvtool next-version -all && cd ..
}

podInstall() {
  cd ios && pod install && cd ..
}

build() {
  xcodebuild -workspace $PWD/ios/SWDTeamBuilder.xcworkspace \
             -scheme SWDTeamBuilder \
             -destination generic/platform=iOS \
             build
}

archive() {
  xcodebuild -workspace $PWD/ios/SWDTeamBuilder.xcworkspace \
             -scheme SWDTeamBuilder \
             -sdk iphoneos \
             -configuration AppStoreDistribution \
             -archivePath $PWD/ios/build/SWDTeamBuilder.xcarchive \
             archive
}

exportArchive() {
  xcodebuild -exportArchive \
             -archivePath $PWD/ios/build/SWDTeamBuilder.xcarchive \
             -exportOptionsPlist $PWD/ios/exportOptions.plist \
             -exportPath $PWD/ios/build \
             -allowProvisioningUpdates
}

upload() {
  xcrun altool --upload-app \
               -f $PWD/ios/build/SWDTeamBuilder.ipa \
               -u $@ \
               -p "@keychain:AC_PASSWORD"
}

push() {
  bumpBuild && podInstall && build && archive && exportArchive && upload
}

# we must have exactly one task, and maybe some arguments for that task
# checking for emptiness of the command line argument string is a convenient
# way to bail out early if we weren't told what to do
[[ -n $@ ]] || exit 1

$@
