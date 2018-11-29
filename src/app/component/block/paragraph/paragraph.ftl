<#ftl output_format="HTML">
<#include "/general/button/button.ftl">

<div data-component="paragraph">
  <h2>${data.title}</h2>

  <p>${data.content?no_esc}</p>

  <#if data.contentMore.length() gt 0 >
    <p class="js-content-more hidden">${data.contentMore?no_esc}</p>

    <@button text="${data.ctaReadMore}"/>
  </#if>
</div>
