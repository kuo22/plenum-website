# README Disclaimer
* To-do lists stored here are temporary. They will be moved to the Projects section of Github.
* Instructions on set-up will be added soon (updated local environment variables, how to serve website, etc.)
* Instructions on repository pushing/pulling will be added soon
* Branches will soon be cleaned up/removed and an organized branching system will be implemented soon

# Standards Used

 [Vue CSS Organization Standards](https://vuejs.org/v2/style-guide/#Component-style-scoping-essential)
1. Box
2. Border
3. Background
4. Text
5. Other

######Organize CSS Resources
* [Get BEM](http://getbem.com/introduction/)
* [SMACSS](https://smacss.com/book/formatting)

___

## "Props Down Events Up"

[Vue Components to Use Props Down Events Up](https://vuejs.org/v2/style-guide/#Implicit-parent-child-communication-use-with-caution)

___

# Implement WAI-ARIA Accessibility Standards

## Accessibility To-Dos
* [] Add alt attribute to all images (add alt content via Drupal)
* [] [Contain website in one landmark?](https://dequeuniversity.com/rules/axe/3.0/landmark-one-main?application=AxeChrome
)
* [] Move focus to issue index after issue selection (insert articles into 'tabindex' order between submenu section link 'tabindex's)
* [] Implement main tags in each main content view
https://dequeuniversity.com/rules/axe/3.0/bypass?application=AxeChrome
    * [] Add an h1 tag to main **all** main content views
    https://dequeuniversity.com/rules/axe/3.0/page-has-heading-one?application=AxeChrome
* [] Decide if it is necessary to remove tabindex in vue structure
        https://www.w3.org/TR/WCAG20-TECHS/F44.html
* [] Add arrow key controls [example](https://forumjs.org/t/navigate-through-list-using-arrowkeys/30689)
* [] [Add breadcrumbs navigation for content pages?](https://www.w3.org/TR/wai-aria-practices/examples/breadcrumb/index.html)

* [] [Parent menus should control the focus of submenus](http://accessibility.athena-ict.com/aria/tests/menus.shtml)
  * Find a way to check if focus is being managed? Idk why, for testing?

#### Accessibility Manual Testing
* [] [VoiceOver Testing Tutorial](https://webaim.org/articles/voiceover/)
* [] [Screen Reader Testing Tutorial](https://webaim.org/articles/jaws/)
* [] [Non-Visual Desktop Access Testing Tutorial](https://webaim.org/articles/nvda/)

###### Accessibility Resources
* [WebAIM](https://webaim.org) - Testing Articles
* [Getting Started with Web Accessibility in Vue](https://medium.com/@emilymears/getting-started-with-web-accessibility-in-vue-17e2c4ea0842)
* [W3 HTML Techniques for Web Content Accessibility Guidelines 1.0](https://www.w3.org/TR/WCAG10-HTML-TECHS/#edef-MAP) - Index of Web Accessibility Standards
* [Menu Navigation Concepts](https://www.w3.org/WAI/tutorials/menus/)
* [Menubar Example](https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html)
* [Keyboard only focus](http://kizu.ru/en/blog/keyboard-only-focus/#x)

___

## Design

#### Navigation

#### [Fetching after Navigation](https://routerjs.org/guide/advanced/data-fetching.html#fetching-after-navigation) Implementation
* [] Add loading filler

#### Logo
* [] Embed 'PLENUM', same typeface as mock-up covers

#### Responsiveness
Design drafts for portable devices before implementing
* [] Text article headroom breaks on some window resizes
* [] Add min-height to main menu and navbar
* [] Add width-change points
* [] [Implement this method to scale fonts?](https://forumjs.org/t/scaling-font-size-to-container-in-idiomatic-vue/17442)

#### Main Content Area
* [] Implement horizontal fixed window splitter (slider to move sections of the webpage)
  * [Fixed Window Splitter](https://www.w3.org/TR/wai-aria-practices/#windowsplitter)

### Article Page
* [] Fix font-size in entire design to something more pleasing
* [] Add 'pagination' to previous and next articles
___

## Bugs

#### Fix 'Vue Warnings'
Address all Vue warnings that appear in console during runtime; otherwise, justify why it must remain.

#### CSS
* [] Article menu styling conflicts with text article view

### Navigation
* [x] 'Publication' menu-item receives focus after article is opened with mouse click,
[according to WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html), focus 
doesn't move anywhere after link activation (article selection). Maybe send focus to the 'main' landmark?
* [] Test efficacy of submenu slide via CSS transitions rather than Vue transitions
* [] Change transition of issue preview box shadow to improve jumpiness
* [] Clicking between main menu items doesn't toggle the open menu - should they be toggle radio menu somehow?

___

## Unit Testing
[DO IT](https://vuejs.org/v2/guide/unit-testing.html)
* Continue reviewing the VueJS Basics
