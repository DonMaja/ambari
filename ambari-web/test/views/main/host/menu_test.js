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
var view;

describe('App.MainHostMenuView', function () {

  beforeEach(function () {
    view = App.MainHostMenuView.create({});
  });

  describe('#content', function () {

    beforeEach(function () {
      this.mock = sinon.stub(App, 'get');
    });

    afterEach(function () {
      App.get.restore();
    });

    Em.A([
        {
          stackVersionsAvailable: true,
          stackUpgrade: true,
          m: '`versions` is visible',
          e: false
        },
        {
          stackVersionsAvailable: true,
          stackUpgrade: false,
          m: '`versions` is invisible (1)',
          e: true
        },
        {
          stackVersionsAvailable: false,
          stackUpgrade: true,
          m: '`versions` is invisible (2)',
          e: true
        },
        {
          stackVersionsAvailable: false,
          stackUpgrade: false,
          m: '`versions` is invisible (3)',
          e: true
        }
      ]).forEach(function (test) {
        it(test.m, function () {
          this.mock.withArgs('stackVersionsAvailable').returns(test.stackVersionsAvailable);
          this.mock.withArgs('supports.stackUpgrade').returns(test.stackUpgrade);
          view.propertyDidChange('content');
          expect(view.get('content').findProperty('name', 'versions').get('hidden')).to.equal(test.e);
        });
      });

    Em.A([
      {
        logSearch: false,
        m: '`logs` tab is invisible',
        e: true
      },
      {
        logSearch: true,
        m: '`logs` tab is visible',
        e: false
      }
    ]).forEach(function(test) {
      it(test.m, function() {
          this.mock.withArgs('supports.logSearch').returns(test.logSearch);
          view.propertyDidChange('content');
          expect(view.get('content').findProperty('name', 'logs').get('hidden')).to.equal(test.e);
      });
    });
  });

  describe("#updateAlertCounter()", function() {

    it("CRITICAL alerts", function() {
      view.setProperties({
        host: Em.Object.create({
          criticalWarningAlertsCount: 1,
          alertsSummary: Em.Object.create({
            CRITICAL: 1,
            WARNING: 0
          })
        })
      });
      view.updateAlertCounter();
      expect(view.get('content').findProperty('name', 'alerts').get('badgeText')).to.equal('1');
      expect(view.get('content').findProperty('name', 'alerts').get('badgeClasses')).to.equal('label alerts-crit-count');
    });

    it("WARNING alerts", function() {
      view.setProperties({
        host: Em.Object.create({
          criticalWarningAlertsCount: 1,
          alertsSummary: Em.Object.create({
            CRITICAL: 0,
            WARNING: 1
          })
        })
      });
      view.updateAlertCounter();
      expect(view.get('content').findProperty('name', 'alerts').get('badgeText')).to.equal('1');
      expect(view.get('content').findProperty('name', 'alerts').get('badgeClasses')).to.equal('label alerts-warn-count');
    });
  });

  describe("#deactivateChildViews()", function() {
    it("active attr should be empty", function() {
      view.set('_childViews', [Em.Object.create({active: 'active'})]);
      view.deactivateChildViews();
      expect(view.get('_childViews').mapProperty('active')).to.eql(['']);
    });
  });

});