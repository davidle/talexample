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

require.def("sampleapp/appui/components/webgltestcomponent",
        [
            "antie/widgets/component",
            "antie/widgets/button",
            "antie/widgets/label",
            "antie/widgets/verticallist",
            "antie/widgets/glwidget",
            "antie/videosource",
            "antie/widgets/media"
        ],
        function(Component, Button, Label, VerticalList, GLWidget, VideoSource, Media) {

            // All components extend Component
            return Component.extend({
                init: function() {
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
                    debugger;
                    this.addEventListener("beforerender", function (ev) {
                        self._onBeforeRender(ev);
                    });


                    try {

                        var back = new Button('back');
                        back.appendChildWidget(new Label('BACK'));
                        back.addEventListener('select', function(evt) {
                            //		self.showBackground();
                            self.glWidget.dispose();
                            self._player.destroy();
                            self.removeChildWidget(self._player);
                            self._player = null;
                            self.removeChildWidget(self.glWidget);
                            self.parentWidget.back();
                        });

                        var test4 = new Button('test4');
                        test4.appendChildWidget(new Label('Add video cube'));
                        test4.addEventListener('select', function(evt) {
                            self.addTestCube3();
                            var callback3 = function() {
                                self.mesh.rotation.x += 0.01;
                                self.mesh.rotation.y += 0.02;
                                self.mesh2.rotation.x += 0.01;
                                self.mesh2.rotation.y += 0.02;

                                if (self.mesh3) {
                                    self.mesh3.rotation.x += 0.01;
                                    self.mesh3.rotation.y += 0.02;
                                    if (self._player.outputElement.readyState === self._player.outputElement.HAVE_ENOUGH_DATA) {
                                        self.mesh3tex.needsUpdate = true;
                                    }

                                }
                            };

                            self.glWidget.setAnimCallback(callback3);
                            back.focus();
                        });

                        var test3 = new Button('test3');
                        test3.appendChildWidget(new Label('Add texture cube'));
                        test3.addEventListener('select', function(evt) {
                            self.addTestCube2();
                            var callback2 = function() {
                                self.mesh.rotation.x += 0.01;
                                self.mesh.rotation.y += 0.02;
                                if (self.mesh2) {
                                    self.mesh2.rotation.x += 0.01;
                                    self.mesh2.rotation.y += 0.02;
                                }
                            };

                            self.glWidget.setAnimCallback(callback2);
                            test4.focus();
                        });

                        var test2 = new Button('test2');
                        test2.appendChildWidget(new Label('Add wireframe cube'));
                        test2.addEventListener('select', function(evt) {

                            self.addTestCube();
                            var callback = function() {
                                self.mesh.rotation.x += 0.01;
                                self.mesh.rotation.y += 0.02;
                            };
                            self.glWidget.setAnimCallback(callback);
                            self.glWidget.startAnimation();
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
                _onBeforeRender: function(ev) {
                                    var size = {
                            width: 960,
                            height: 400
                        };
                        this.glWidget = new GLWidget("testGL", size);
                        this.appendChildWidget(this.glWidget);
                },
                hideBackground: function() {
                    this._device.addClassToElement(document.body, 'background-none');
                    this._application.getRootWidget().addClass('background-none');
                },
                showBackground: function() {
                    if (this._device.getPlayerEmbedMode() === Media.EMBED_MODE_BACKGROUND) {
                        this._device.removeClassFromElement(document.body, 'background-none');
                        this._application.getRootWidget().removeClass('background-none');
                    }
                },
                /**
                 * Adds a simple wireframe mesh for test
                 */
                addTestCube: function() {
                    var geometry = new this.glWidget.THREE.CubeGeometry(200, 200, 200);
                    var material = new this.glWidget.THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

                    this.mesh = new this.glWidget.THREE.Mesh(geometry, material);
                    this.glWidget.scene.add(this.mesh);
                    this.glWidget.renderer.setClearColorHex(0x555, 1);
                },
                addTestCube2: function() {
                    var self = this;

                    var geometry = new this.glWidget.THREE.CubeGeometry(200, 200, 200);
                    this.glWidget.THREE.ImageUtils.loadTexture('static/img/b-texture-inv.png', {}, function(texture) {

                        var material = new self.glWidget.THREE.MeshBasicMaterial({map: texture});

                        self.mesh2 = new self.glWidget.THREE.Mesh(geometry, material);
                        self.mesh2.position.x = -400;
                        self.glWidget.scene.add(self.mesh2);
                    });


                },
                addTestCube3: function() {
                    var self = this;
                    // Create a video player
                    var videoUrl = "static/mp4/spinning-logo.mp4";
                    var videoType = "video/mp4";

                    // Create the player and append it to the component
                    this._player = this._device.createPlayer('testPlayer', 'video');
                    this._player.addClass('visibility-hidden');

                    this.appendChildWidget(this._player);

                    // Start playing the video as soon as the device fires an antie 'canplay' event
                    this._player.addEventListener('canplay', function(evt) {
                        self._player.outputElement.hidden = true;

                        self._player.play();

                        var geometry = new self.glWidget.THREE.CubeGeometry(200, 200, 200);
                        //var vel = document.getElementById(self._player.id)
                        self.mesh3tex = new self.glWidget.THREE.Texture(self._player.outputElement);
                        self.mesh3tex.generateMipmaps = false;
                        self.mesh3tex.magFilter = self.glWidget.THREE.LinearFilter;
                        self.mesh3tex.minFilter = self.glWidget.THREE.LinearFilter;

                        var material = new self.glWidget.THREE.MeshBasicMaterial({color: 0xffffff, map: self.mesh3tex});

                        self.mesh3 = new self.glWidget.THREE.Mesh(geometry, material);
                        self.mesh3.position.x = 400;
                        self.glWidget.scene.add(self.mesh3);

                    });

                    this._player.setSources([new VideoSource(videoUrl, videoType)]);
                    this._player.load();

                },
            });
        });
