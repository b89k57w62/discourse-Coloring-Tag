
import { withPluginApi } from "discourse/lib/plugin-api";
import User from "discourse/models/user";
import { escapeExpression } from "discourse/lib/utilities";
import getURL from "discourse-common/lib/get-url";
import { helperContext } from "discourse-common/lib/helpers";

export default {
  name: "discourse-coloring-tag",

  initialize() {
    withPluginApi("0.8.18", (api) => {
      var tagColors = settings.Tag_color.split("|");
      var tags = [];
      var backgroundColors = [];
      var colors = [];
      tagColors.forEach(el => {
        let [tag, backgroundColor, color] = el.split(",");
        tags.push(tag);
        backgroundColors.push(backgroundColor);
        colors.push(color);
      })

      function customRenderTag(tag, params) {
        // This file is in lib but it's used as a helper
        let siteSettings = helperContext().siteSettings;
      
        params = params || {};
        const visibleName = escapeExpression(tag);
        tag = visibleName.toLowerCase();
        const index = tags.indexOf(tag);
        var backgroundColor;
        var color;
        if (index > -1) {
          backgroundColor = backgroundColors[index];
          color = colors[index];
        }
        // console.log("tag: " + tag + " backgroundColor:" + color + " color:" + color);
        const classes = ["discourse-tag"];
        const tagName = params.tagName || "a";
        let path;
        if (tagName === "a" && !params.noHref) {
          if ((params.isPrivateMessage || params.pmOnly) && User.current()) {
            const username = params.tagsForUser
              ? params.tagsForUser
              : User.current().username;
            path = `/u/${username}/messages/tags/${tag}`;
          } else {
            path = `/tag/${tag}`;
          }
        }
        const href = path ? ` href='${getURL(path)}' ` : "";
      
        if (siteSettings.tag_style || params.style) {
          classes.push(params.style || siteSettings.tag_style);
        }
        if (params.size) {
          classes.push(params.size);
        }
      
        var val;
        if (backgroundColor && color) {
          val =
            "<" +
            tagName +
            href +
            " data-tag-name=" +
            tag +
            " style='" +
            "background-color:" + backgroundColor + ";" +
            " color:" + color + "!important;'" +
            " class='" +
            classes.join(" ") +
            "'>" +
            visibleName +
            "</" +
            tagName +
            ">";
        } else {
          val =
            "<" +
            tagName +
            href +
            " data-tag-name=" +
            tag +
            " class='" +
            classes.join(" ") +
            "'>" +
            visibleName +
            "</" +
            tagName +
            ">";
        }
        
        // console.log(val);
      
        if (params.count) {
          val += " <span class='discourse-tag-count'>x" + params.count + "</span>";
        }
      
        return val;
      }

      api.replaceTagRenderer(customRenderTag)
    
    });
  },
};


