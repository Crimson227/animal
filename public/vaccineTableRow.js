(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['vaccineTableRow'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"table-entry\">\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":16}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"species") || (depth0 != null ? lookupProperty(depth0,"species") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"species","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":19}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"doses") || (depth0 != null ? lookupProperty(depth0,"doses") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"doses","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":17}}}) : helper)))
    + "</th>\n</tr>";
},"useData":true});
})();