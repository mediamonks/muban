<#ftl output_format="HTML">

<div data-component="app-root">
  <#include "/layout/header/header.ftl">

  <div class="wrapper">
    <h1>${title}</h1>

    <div class="content">
      <#list blocks as block>
        <#assign data = block.data>
        <#include "/block/${block.name}/${block.name}.ftl">
      </#list>
    </div>
  </div>

  <#include "/layout/footer/footer.ftl">
</div>
