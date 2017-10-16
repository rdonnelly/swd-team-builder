/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <BugsnagReactNative/BugsnagReactNative.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [BugsnagReactNative start];

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SWDTeamBuilder"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:236.0/255.0 green:240.0/255.0 blue:241.0/255.0 alpha:1.0];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  UIImageView* loadingView = [[UIImageView alloc] initWithFrame:rootView.bounds];
  [loadingView setImage:[UIImage imageNamed:@"LaunchImage"]];
  [loadingView setBackgroundColor:[[UIColor alloc] initWithRed:236.0/255.0 green:240.0/255.0 blue:241.0/255.0 alpha:1.0]];
  [loadingView setContentMode:UIViewContentModeCenter];
  rootView.loadingView = loadingView;
  rootView.loadingViewFadeDelay = 0.5;
  rootView.loadingViewFadeDuration = 0.5;
  
  return YES;
}

@end
