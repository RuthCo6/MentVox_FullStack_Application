declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// אם אתה משתמש ב-CSS Modules (קובצי .module.css), תוסיף גם את זה:
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}