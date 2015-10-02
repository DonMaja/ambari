/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');

App.ServiceConfigLayoutTabView = Em.View.extend(App.ConfigOverridable, {

  /**
   * Determines if view is editable
   * It true - show all control-elements (undo, override, finalize etc) for each widget
   * If false - no widgets control-elements will be shown
   * Bound from template
   * @type {boolean}
   */
  canEdit: true,

  /**
   * view need some time to prepare data to display it correct
   * before that it's better not to show anything
   * @type {boolean}
   */
  dataIsReady: false,

  /**
   * @type {App.Service}
   */
  service: function () {
    return this.get('controller.selectedService');
  }.property('controller.selectedService'),

  templateName: require('templates/common/configs/service_config_layout_tab'),

  classNames: ['enhanced-config-tab-content'],
  /**
   * ConfigType-Widget map
   * key - widget type
   * value - widget view
   * @type {object}
   */
  widgetTypeMap: {
    checkbox: App.CheckboxConfigWidgetView,
    combo: App.ComboConfigWidgetView,
    directory: App.DirectoryConfigWidgetView,
    directories: App.DirectoryConfigWidgetView,
    list: App.ListConfigWidgetView,
    password: App.PasswordConfigWidgetView,
    'radio-buttons': App.RadioButtonConfigWidgetView,
    slider: App.SliderConfigWidgetView,
    'text-field': App.TextFieldConfigWidgetView,
    'time-interval-spinner': App.TimeIntervalSpinnerView,
    toggle: App.ToggleConfigWidgetView,
    'text-area': App.StringConfigWidgetView,
    'test-db-connection': App.TestDbConnectionWidgetView
  },

  /**
   * Prepare configs for render
   * <code>subsection.configs</code> is an array of App.StackConfigProperty, but not App.ConfigProperty,
   * so proper config-properties should be linked to the subsections.
   * @method prepareConfigProperties
   */
  prepareConfigProperties: function () {
    var self = this;
    this.get('content.sectionRows').forEach(function (row) {
      row.forEach(function (section) {
        section.get('subsectionRows').forEach(function (subRow) {
          subRow.forEach(function (subsection) {
            var uiOnlyConfigs = App.uiOnlyConfigDerivedFromTheme.filterProperty('subSection.name', subsection.get('name'));
            self.setConfigsToContainer(subsection, uiOnlyConfigs);
            subsection.get('subSectionTabs').forEach(function (subSectionTab) {
              self.setConfigsToContainer(subSectionTab);
            });
          });
        });
      });
    });
  },

  /**
   * set {code} configs {code} array of subsection or subsection tab.
   * Also correct widget should be used for each config (it's selected according to <code>widget.type</code> and
   * <code>widgetTypeMap</code>). It may throw an error if needed widget can't be found in the <code>widgetTypeMap</code>
   * @param containerObject
   * @param [uiOnlyConfigs]
   */
  setConfigsToContainer: function(containerObject, uiOnlyConfigs) {
    var self = this;
    var service = this.get('controller.stepConfigs').findProperty('serviceName', this.get('controller.selectedService.serviceName'));
    if (!service) return;
    containerObject.set('configs', []);

    containerObject.get('configProperties').toArray().concat(uiOnlyConfigs || []).forEach(function (config) {

      var configProperty = service.get('configs').findProperty('name', config.get('name'));
      if (!configProperty) return;

      containerObject.get('configs').pushObject(configProperty);
      var configWidgetType = config.get('widget.type');
      var widget = self.get('widgetTypeMap')[configWidgetType];
      Em.assert('Unknown config widget view for config ' + configProperty.get('id') + ' with type ' + configWidgetType, widget);

      var additionalProperties = {
        widget: widget,
        stackConfigProperty: config
      };

      var configConditions = App.ConfigCondition.find().filter(function (_configCondition) {
        var conditionalConfigs = _configCondition.get('configs').filterProperty('fileName', config.get('filename')).filterProperty('configName', config.get('name'));
        return (conditionalConfigs && conditionalConfigs.length);
      }, this);

      if (configConditions && configConditions.length) {
        additionalProperties.configConditions = configConditions;
      }
      configProperty.setProperties(additionalProperties);

      if (configProperty.get('overrides')) {
        configProperty.get('overrides').setEach('stackConfigProperty', config);
      }
      if (configProperty.get('compareConfigs')) {
        configProperty.get('compareConfigs').invoke('setProperties', {
          isComparison: false,
          stackConfigProperty: config
        });
      }
    });
  },

  /**
   * changes active subsection tab
   * @param event
   */
  setActiveSubTab: function(event) {
    if (!event.context) return;
    try {
      event.context.get('subSection.subSectionTabs').setEach('isActive', false);
      event.context.set('isActive', true);
    } catch (e) {
      console.error('Can\'t update active subsection tab');
    }
  },

  didInsertElement: function () {
    this.set('dataIsReady', false);
    this._super();
    this.prepareConfigProperties();
    if (this.get('controller.isCompareMode')) {
      this.get('parentView').filterEnhancedConfigs();
    }
    this.set('dataIsReady', true);
  }

});