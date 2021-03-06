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

/**
 * THIS IS NOT USED FOR NOW
 * FOR CONFIG GROUPS WE ARE USING OLD MODELS AND LOGIC
 */

var App = require('app');

App.ConfigAction = DS.Model.extend({

  hostComponent: DS.attr('string'),

  configs: DS.attr('array', {defaultValue: []}),

  /**
   * conditional String which can be evaluated to boolean result.
   * If evaluated result of this staring is true then use the statement provided by `then` attribute.
   * Otherwise use the attribute provided by `else` attributes
   */
  if: DS.attr('string'),
  then: DS.attr('string'),
  else: DS.attr('string')

});

App.ConfigAction.FIXTURES = [
  {
    id:1,
    host_component: 'HIVE_SERVER_INTERACTIVE',
    "configs":[
      {
        configName: "enable_hive_interactive",
        fileName: "llap-env.xml"
      }
    ],
    if:'${llap-env/enable_hive_interactive}',
    then:'add',
    else: 'delete'
  }
];
