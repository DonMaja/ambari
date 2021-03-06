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

require('views/wizard/step5_view');

App.AssignMasterOnStep7View = App.AssignMasterComponentsView.extend({

  title: Em.I18n.t('installer.step5.header'),

  alertMessage: '',

  isBackButtonVisible: false,

  willInsertElement: function() {
    this._super();
    var mastersToCreate = this.get('controller.mastersToCreate');
    var mastersToCreateDisplayName =  mastersToCreate.map(function(item){
      return App.StackServiceComponent.find().findProperty('componentName', item).get('displayName');
    });
    var stringText1 =  mastersToCreate.length > 1 ? 'hosts' : 'host';
    var stringText2 =  mastersToCreate.length > 1 ? 'them' : 'it';
    var alertMessage = Em.I18n.t('installer.step7.assign.master.body').format(mastersToCreateDisplayName.join(), stringText1, stringText2);
    this.set('alertMessage', alertMessage)
  }

});
