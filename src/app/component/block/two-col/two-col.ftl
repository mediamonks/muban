<#ftl output_format="HTML">

<div data-component="two-col">
  <div class="col col-left">
    <h3>${data.left.title}</h3>
    <p>${data.left.content?no_esc}</p>
  </div>

  <div class="col col-right">
    <h3>${data.right.title}</h3>
    <p>${data.right.content?no_esc}</p>
  </div>
</div>
