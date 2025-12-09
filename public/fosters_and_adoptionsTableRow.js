(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['fosters_and_adoptionsTableRow'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"table-entry\">\n    <th class=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"animalID") || (depth0 != null ? lookupProperty(depth0,"animalID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalID","hash":{},"data":data,"loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":27}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"animalName") || (depth0 != null ? lookupProperty(depth0,"animalName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalName","hash":{},"data":data,"loc":{"start":{"line":2,"column":29},"end":{"line":2,"column":43}}}) : helper)))
    + "</th>\n    <th class=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"patronID") || (depth0 != null ? lookupProperty(depth0,"patronID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"patronID","hash":{},"data":data,"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":27}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"firstName") || (depth0 != null ? lookupProperty(depth0,"firstName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstName","hash":{},"data":data,"loc":{"start":{"line":3,"column":29},"end":{"line":3,"column":42}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"lastName") || (depth0 != null ? lookupProperty(depth0,"lastName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastName","hash":{},"data":data,"loc":{"start":{"line":3,"column":43},"end":{"line":3,"column":55}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"fosteredOrAdopted") || (depth0 != null ? lookupProperty(depth0,"fosteredOrAdopted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fosteredOrAdopted","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":29}}}) : helper)))
    + "</th>\n    <th>"
    + alias4(((helper = (helper = lookupProperty(helpers,"date") || (depth0 != null ? lookupProperty(depth0,"date") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":16}}}) : helper)))
    + "</th>\n</tr>";
},"useData":true});
})();