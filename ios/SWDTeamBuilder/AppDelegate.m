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
  
  
  
  UIView *loadingView = [[UIView alloc] initWithFrame:rootView.bounds];
  [loadingView setBackgroundColor:[[UIColor alloc] initWithRed:236.0/255.0 green:240.0/255.0 blue:241.0/255.0 alpha:1.0]];
  
  
  
  UIImageView* splashView = [[UIImageView alloc] initWithFrame:loadingView.bounds];
  [splashView setImage:[UIImage imageNamed:@"splash"]];
  [splashView setContentMode:UIViewContentModeCenter];
  [loadingView addSubview:splashView];
  
  
  
  UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
  spinner.color = [[UIColor alloc] initWithRed:155.0/255.0 green:89.0/255.0 blue:182.0/255.0 alpha:1.0];
  spinner.center = CGPointMake(loadingView.frame.size.width * 0.5, loadingView.frame.size.height * 0.85);
  [spinner startAnimating];
  [loadingView addSubview:spinner];
  
  
  
  rootView.loadingView = loadingView;
  rootView.loadingViewFadeDelay = 0.5;
  rootView.loadingViewFadeDuration = 0.5;
  
  return YES;
}

@end
