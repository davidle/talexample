/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 *           (http://www.bbc.co.uk) and TAL Contributors (1)
 * 
 * (1) TAL Contributors are listed in the AUTHORS file and at
 * https://github.com/fmtvp/TAL/AUTHORS - please extend this file, not this
 * notice.
 * 
 * @license Licensed under the Apache License, Version 2.0 (the "License"); you
 *          may not use this file except in compliance with the License. You may
 *          obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 * All rights reserved Please contact us for an alternative licence
 */

require.def("sampleapp/appui/components/webgltestcomponent", [ "antie/widgets/component", "antie/widgets/button",
		"antie/widgets/label", "antie/widgets/verticallist", "antie/widgets/glwidget", ], function(Component, Button,
		Label, VerticalList, GLWidget) {

	// All components extend Component
	return Component.extend({
		init : function() {
			var self = this;
			// It is important to call the constructor of the superclass
			this._super("webgltestcomponent");
			// Get a reference to the current application and device
			// objects
			this._application = this.getCurrentApplication();
			this._device = this._application.getDevice();

			// Create a a label add a class to it, this class can be used as a
			// CSS selector
			var description = new Label("WebGL test...");
			description.addClass("description");
			this.appendChildWidget(description);

			var verticalListMenu = new VerticalList("mainMenuList");
			this.appendChildWidget(verticalListMenu);
			//this.hideBackground();

			try {
				var size = {
					width : 960,
					height : 400
				};
				var testGLWidget = new GLWidget("testGL", size);
				this.appendChildWidget(testGLWidget);
				
				var back = new Button('back');
				back.appendChildWidget(new Label('BACK'));
				back.addEventListener('select', function(evt) {
			//		self.showBackground();
					testGLWidget.dispose();
					self.removeChildWidget(testGLWidget);
					self.parentWidget.back();
				});
				
				var test4 = new Button('test4');
				test4.appendChildWidget(new Label('Add video cube'));
				test4.addEventListener('select', function(evt) {
					testGLWidget.addTestCube3();
					var callback3 = function() {
						testGLWidget.mesh.rotation.x += 0.01;
						testGLWidget.mesh.rotation.y += 0.02;
						testGLWidget.mesh2.rotation.x += 0.01;
						testGLWidget.mesh2.rotation.y += 0.02;
						
						if(testGLWidget.mesh3){
							testGLWidget.mesh3.rotation.x += 0.01;
							testGLWidget.mesh3.rotation.y += 0.02;
						}
					};

					testGLWidget.setAnimCallback(callback3);
					back.focus();
				});
				
				var test3 = new Button('test3');
				test3.appendChildWidget(new Label('Add texture cube'));
				test3.addEventListener('select', function(evt) {
					testGLWidget.addTestCube2();
					var callback2 = function() {
						testGLWidget.mesh.rotation.x += 0.01;
						testGLWidget.mesh.rotation.y += 0.02;
						if(testGLWidget.mesh2){
							testGLWidget.mesh2.rotation.x += 0.01;
							testGLWidget.mesh2.rotation.y += 0.02;
						}
					};

					testGLWidget.setAnimCallback(callback2);
					test4.focus();
				});

				var test2 = new Button('test2');
				test2.appendChildWidget(new Label('Load simple scene'));
				test2.addEventListener('select', function(evt) {

					testGLWidget.addTestCube();
					var callback = function() {
						testGLWidget.mesh.rotation.x += 0.01;
						testGLWidget.mesh.rotation.y += 0.02;
					};
					testGLWidget.setAnimCallback(callback);
					testGLWidget.startAnimation();
					test3.focus();

				});

				verticalListMenu.appendChildWidget(test2);
				verticalListMenu.appendChildWidget(test3);
				verticalListMenu.appendChildWidget(test4);
				verticalListMenu.appendChildWidget(back);


			} catch (err) {

				var test4 = new Button('test4');
				test4.appendChildWidget(new Label('Failed to get WebGL context'));
				verticalListMenu.appendChildWidget(test4);
				test4.addEventListener('select', function(evt) {
			//		self.showBackground();
					self.parentWidget.back();
				});

			} 
		},
		_onBeforeRender : function(ev) {

		},

		hideBackground : function() {
			this._device.addClassToElement(document.body, 'background-none');
			this._application.getRootWidget().addClass('background-none');
		},
		showBackground : function() {
			if (this._device.getPlayerEmbedMode() === Media.EMBED_MODE_BACKGROUND) {
				this._device.removeClassFromElement(document.body, 'background-none');
				this._application.getRootWidget().removeClass('background-none');
			}
		}
	});
});
