// @ts-ignore
if (window.inExtension === undefined) {
  setInterval(() => {
    const commentDom = document.querySelectorAll("#root .live-panel--D4erU .comment-wrap--jjwHQ .ReactVirtualized__Grid__innerScrollContainer > div")
    const commentList = Array.from(commentDom).map((div)=>{
      for (const key in div) {
        if (/^__reactProps\$\w+$/g.test(key)) {
          const props = (div as any)[key]?.children?.props?.data;
          return props;
        }
      }
    }).filter((data)=> data).sort((commentA, commentB) => commentA.commentTime - commentB.commentTime);
    window.postMessage({type: "commentList", data: commentList}, "*")
  }, 5000);
}

export { }
