## Accessibility Resources
* [WebAIM](https://webaim.org) - Testing Articles
* [Getting Started with Web Accessibility in Vue](https://medium.com/@emilymears/getting-started-with-web-accessibility-in-vue-17e2c4ea0842)
* [W3 HTML Techniques for Web Content Accessibility Guidelines 1.0](https://www.w3.org/TR/WCAG10-HTML-TECHS/#edef-MAP) - Index of Web Accessibility Standards
* [Menu Navigation Concepts](https://www.w3.org/WAI/tutorials/menus/)

##### Specific Resources
* [Keyboard only focus](http://kizu.ru/en/blog/keyboard-only-focus/#x)

## To-do


### Accessibility
* [] Add alt attribute to all images (in Drupal too)
* [] Contain website in one landmark? 
https://dequeuniversity.com/rules/axe/3.0/landmark-one-main?application=AxeChrome
* [] Move focus to issue index after issue selection (insert articles into 'tabindex' order between submenu section link 'tabindex's)
* [] Implement main tags in each main content view
https://dequeuniversity.com/rules/axe/3.0/bypass?application=AxeChrome
    * [] Add an h1 tag to main **all** main content views
    https://dequeuniversity.com/rules/axe/3.0/page-has-heading-one?application=AxeChrome
* [] Decide if it is necessary to remove tabindex in vue structure
        https://www.w3.org/TR/WCAG20-TECHS/F44.html
* [] Add arrow key controls [example](https://forum.vuejs.org/t/navigate-through-list-using-arrowkeys/30689)
* [x] Fix focus container size for main menu items
* [x] Fix focusability on main menu elements
* [x] Focusability on logo

#### Accessibility Manual Testing
* [] [VoiceOver Testing Tutorial](https://webaim.org/articles/voiceover/)
* [] [Screen Reader Testing Tutorial](https://webaim.org/articles/jaws/)
* [] [Non-Visual Desktop Access Testing Tutorial](https://webaim.org/articles/nvda/)

### Logo
* [] Bug: Animation doesn't stop if article is requested
* [] Embed 'PLENUM', same typeface as mock-up covers
* [x] Thicker lines

### Aesthetics

* [] Add transition to appearance of focus outline
* [] Reduce outline size of submenu item focuses

#### Responsiveness
Design drafts for portable devices before implementing
* [] Add min-height to main menu and navbar
* [] Add width-change points

###### Menu
* [] Give overflow to preview abstract
    * Implement this method to scale fonts https://forum.vuejs.org/t/scaling-font-size-to-container-in-idiomatic-vue/17442

###### Bugs
* [] Fix grid blink on activation of submenu preview
* [] Article menu styling conflicts with text article view


### Main Content Area

### Navigation
* [] Give easy access to active issue article index
* [] Test efficacy of submenu slide via CSS transitions rather than Vue transitions
* [] Change transition of issue preview box shadow to improve jumpiness

### Article Page
* [] Fix font-size in entire design
* [] Add 'pagination' to previous and next articles