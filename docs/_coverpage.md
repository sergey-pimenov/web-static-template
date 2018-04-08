<section class="customCover">
  
  <h1 class="mainTitle"> The main goal of Web static template is do everything that is possible statically. Why it matters? </h1>

  <div class="intro">

    <ul class="reasons">
      <li class="reason">
        Better for performance and as a consequence it's better for users.
        Сlient doesn't need do extra work in browser. All possible work is done when you build project
      </li>

      <li class="reason">
        Redivable. You are 100% sure that everything is generated correctly, independently of user's browsers
      </li>

      <li class="reason">
        Better for indexing your pages by search engines
      </li>

      <li class="reason">
        Your content will be available even client block JavaScript
      </li>
    </ul>
  </div>

  <section class="otherReasons">
    <h2> Use your favorite tools out of the box </h2>

    <div class="toolsGroup">
      <div class="tools">
        <img src="img/less.svg" alt="less" title="less">
        <img src="img/sass.svg" alt="sass" title="sass">
        <img src="img/stylus.svg" alt="stylus" title="stylus">
      </div>

      <div class="tools">
        <img src="img/pug.svg" alt="pug" title="pug">
        <img src="img/handlebars.svg" alt="handlebars" title="handlebars">
        <img src="img/nunjucks.png" alt="nunjucks" title="nunjucks">
      </div>

      <div class="tools">
        <img src="img/js.svg" alt="javascript" title="javascript">
        <img src="img/ts.svg" alt="typescript" title="typescript">
      </div>
    </div>
  </section>

  <div class="links">
    <a class="getStarted" href="#/?id=main-features"> Get started </a>
    <a class="github" href="https://github.com/sergey-pimenov/web-static-template"> <img src="img/github.svg"> Github </a>
  </div>

</section>


<style>

:root {
  --basic-width: 1060px;
  --basic-indent: 30px; 
}

.sidebar-toggle {
  z-index: 101;
}

section.cover h1 {
  margin: unset;
  text-align: inherit;
}

section.cover ul {
  max-width: 100%;
}

section.cover {
  all: unset;
  min-height: 100vh;
  background: linear-gradient(to left bottom, hsl(77, 100%, 85%) 0%,hsl(239, 100%, 85%) 100%) !important;
}

section.cover .cover-main {
  margin: 40px 70px;
  text-align: inherit;
}

@media all and (max-width: 1200px) {
  section.cover .cover-main {
    margin: 20px 20px 0 20px;
  }
}

@media all and (max-width: 768px) {
  .markdown-section {
    padding: 30px 20px 40px;
  }
}

section.cover {
  background: white;
  border-bottom: 1px rgb(230, 230, 230) dashed;
}

section.cover .customCover {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

section.cover .mainTitle {
  width: calc(var(--basic-width) - var(--basic-indent));
  margin: 50px auto 0 auto;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
}

@media all and (max-width: 1200px) {
  section.cover .mainTitle {
    width: auto;
    max-width: 700px;
    margin-top: 30px;
    padding-right: 30px;
    position: relative;
  }
}

.intro {
  max-width: var(--basic-width);
  margin: var(--basic-indent) auto 0 auto;
}

@media all and (max-width: 1200px) {
  .intro {
    max-width: none;
  }
}

.mainDescription {
  font-size: 20px;
}

.reasons {
  margin-top: 0 !important;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
}

@media all and (max-width: 1200px) {
  .reasons {
    flex-direction: column;
  }
}

.reasons .reason {
  max-width: 500px;
  margin: 15px;
  padding: 20px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

@media all and (max-width: 1200px) {
  .reasons .reason {
    max-width: 700px;
    margin: 0 0 20px 0;
  }
}

.otherReasons {
  width: calc(var(--basic-width) - var(--basic-indent));
  margin: 0 auto;
}

@media all and (max-width: 1200px) {
  .otherReasons {
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.otherReasons h2 {
  margin: 50px 0 15px 0;
  font-size: 25px;
  font-weight: bold;
}

@media all and (max-width: 1200px) {
  .otherReasons h2 {
    margin-top: 10px;
    margin-bottom: 0;
  }
}

.toolsGroup {
  display: flex;
}

@media all and (max-width: 1200px) {
  .toolsGroup {
    width: 320px;
    margin-top: 30px;
    flex-direction: column;
  }
}

@media all and (max-width: 480px) {
  .toolsGroup {
    width: 280px;
  }
}

.tools {
  margin: var(--basic-indent) var(--basic-indent) var(--basic-indent) 0;
  padding: 30px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

@media all and (max-width: 1200px) {
  .tools {
    margin: 0 0 20px 0;
    padding: 30px 30px;
  }
}

.tools img {
  height: 50px;
  margin-right: 30px;
}

@media all and (max-width: 1200px) {
  .tools img {
    height: 30px;
    margin-right: 30px;
  }
}

.tools img:last-of-type {
  margin-right: 0;
}

.links {
  margin: 50px auto 0 auto;
  display: flex;
}

@media all and (max-width: 1200px) {
  .links {
    margin: 30px auto 0 auto;
  }
}

.links a {
  padding: 10px 25px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  transition: background-color 0.2s;
}

.links a:hover {
  background-color: rgba(255, 255, 255, 1);
}

.getStarted {
  margin-right: 30px;
}

.github {
  display: flex;
  align-items: center;
}

.github img {
  height: 15px;
  margin-right: 10px;
}



/* Fix bugs with z-index */
main {
  z-index: 10;
}

.github-corner {
  z-index: 11;
}

</style>
