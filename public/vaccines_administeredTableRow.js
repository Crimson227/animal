(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['vaccines_administeredTableRow'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"table-entry\">\n    <th id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"animalID") || (depth0 != null ? lookupProperty(depth0,"animalID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalID","hash":{},"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":24}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"animalName") || (depth0 != null ? lookupProperty(depth0,"animalName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalName","hash":{},"data":data,"loc":{"start":{"line":2,"column":26},"end":{"line":2,"column":40}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"vaccineName") || (depth0 != null ? lookupProperty(depth0,"vaccineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"vaccineName","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":23}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"dateGiven") || (depth0 != null ? lookupProperty(depth0,"dateGiven") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dateGiven","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":21}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"dateExpires") || (depth0 != null ? lookupProperty(depth0,"dateExpires") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dateExpires","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":23}}}) : helper)))
    + "</th>\n</tr>";
},"useData":true});
})();