# jquery-input-slugify
Slugify text input

el = new slugify(".text-input", {
    enable: true, /* boolean or Html Element(checkbox), to allow plugin running */
    targetElement: false, /* boolean or HTML Element where to put slugify result */
    mode: "replace", /* "replace" slugify result to element and target element, "target" slugify result only to target element, "fill" slugify result only to target element if the target element is empty */
});
