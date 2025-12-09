(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['patronTableRow'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"table-entry\">\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"patronID") || (depth0 != null ? lookupProperty(depth0,"patronID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"patronID","hash":{},"data":data,"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":20}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"firstName") || (depth0 != null ? lookupProperty(depth0,"firstName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstName","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":21}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"lastName") || (depth0 != null ? lookupProperty(depth0,"lastName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastName","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":20}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"phoneNumber") || (depth0 != null ? lookupProperty(depth0,"phoneNumber") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"phoneNumber","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":23}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"address") || (depth0 != null ? lookupProperty(depth0,"address") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data,"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":19}}}) : helper)))
    + "</th>\n</tr>";
},"useData":true});
})();