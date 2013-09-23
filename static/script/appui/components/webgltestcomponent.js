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

                    try {
                        //This sets up WebGL environment when the page loads
                        //It will throw an error if WebGL is not available
                        //This is test 1
                        self._onBeforeRender();

                        //Add the back button to return to the menu
                        var back = new Button('back');
                        back.appendChildWidget(new Label('BACK'));
                        back.addEventListener('select', function(evt) {
                            //Completely remove video player and GL canvas
                            self.glWidget.dispose();
                            self._player.destroy();
                            self.removeChildWidget(self._player);
                            self._player = null;
                            self.removeChildWidget(self.glWidget);
                            self.glWidget = null
                            //Return to menu
                            self.parentWidget.back();
                        });

                        //Set up test 4 - video texturing
                        //Expect this to fail on most devices <2014
                        var test4 = new Button('test4');
                        test4.appendChildWidget(new Label('Add video cube'));
                        test4.addEventListener('select', function(evt) {
                            //Add the cube
                            self.addTestCube3();
                            //Create the animation loop:
                            var callback3 = function() {
                                self.mesh.rotation.x += 0.01;
                                self.mesh.rotation.y += 0.02;
                                self.mesh2.rotation.x += 0.01;
                                self.mesh2.rotation.y += 0.02;

                                if (self.mesh3) {
                                    self.mesh3.rotation.x += 0.01;
                                    self.mesh3.rotation.y += 0.02;
                                    //Handle video change every frame
                                    if (self._player.outputElement.readyState === self._player.outputElement.HAVE_ENOUGH_DATA) {
                                        self.mesh3tex.needsUpdate = true;
                                    }
                                }
                            };
                            self.glWidget.setAnimCallback(callback3);
                            back.focus();
                        });

                        //Set up test 3 - simple texturing
                        var test3 = new Button('test3');
                        test3.appendChildWidget(new Label('Add texture cube'));
                        test3.addEventListener('select', function(evt) {
                            //Add the cube
                            self.addTestCube2();
                            //Create the animation loop:
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

                        //Set up test 2 - wireframe mesh
                        var test2 = new Button('test2');
                        test2.appendChildWidget(new Label('Load scene with wireframe cube'));
                        test2.addEventListener('select', function(evt) {
                            //Add the cube
                            self.addTestCube();
                            //Create the animation loop:
                            var callback = function() {
                                self.mesh.rotation.x += 0.01;
                                self.mesh.rotation.y += 0.02;
                            };
                            self.glWidget.setAnimCallback(callback);
                            //Kick off hte animation
                            self.glWidget.startAnimation();
                            test3.focus();
                        });

                        verticalListMenu.appendChildWidget(test2);
                        verticalListMenu.appendChildWidget(test3);
                        verticalListMenu.appendChildWidget(test4);
                        verticalListMenu.appendChildWidget(back);


                    } catch (err) {
                        //If WebGL isn't available, just add the back button:
                        var test4 = new Button('test4');
                        test4.appendChildWidget(new Label('Failed to get WebGL context'));
                        verticalListMenu.appendChildWidget(test4);
                        test4.addEventListener('select', function(evt) {
                            self.parentWidget.back();
                        });

                    }

                    //Add the event listener in case the user exits then re-enters this component
                    this.addEventListener("beforerender", function(ev) {
                        if (!self.glWidget)
                            self._onBeforeRender(ev);
                    });
                },
                /**
                 * Called as the component loads, creates the GLWidget
                 * containing the WebGL canvas
                 * @param {type} ev
                 */
                _onBeforeRender: function(ev) {
                    var size = {
                        width: 960,
                        height: 400
                    };
                    this.glWidget = new GLWidget("testGL", size);
                    this.appendChildWidget(this.glWidget);
                },
                /**
                 * Adds a simple white wireframe mesh for test 2,
                 * also sets a background/clear colour.
                 */
                addTestCube: function() {
                    var geometry = new this.glWidget.THREE.CubeGeometry(200, 200, 200);
                    var material = new this.glWidget.THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

                    this.mesh = new this.glWidget.THREE.Mesh(geometry, material);
                    this.glWidget.scene.add(this.mesh);
                    this.glWidget.renderer.setClearColorHex(0x555, 1);
                },
                /**
                 *  Adds the cube for test 3, loads a png as a texture
                 */
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
                /**
                 *  Adds the cube for test 4, loads a video as a texture.
                 *  The video is sourced from a TAL media player, this is a somewhat
                 *  pointless abstraction as only a HTML5 video element will work.
                 *  
                 *  The source video is N-POT (Non-Power Of Two sized) so some
                 *  devices will be unable to use it. 
                 */
                addTestCube3: function() {
                    var self = this;
                    // Video source
                    var videoUrl = "static/mp4/spinning-logo.mp4";
                    var videoType = "video/mp4";

                    // Create the player and append it to the component
                    this._player = this._device.createPlayer('testPlayer', 'video');
                    this._player.addClass('visibility-hidden');
                    this.appendChildWidget(this._player);

                    // Start playing the video as soon as the device fires an antie 'canplay' event
                    this._player.addEventListener('canplay', function(evt) {
                        //Hide the video as it is only seen as a texture
                        self._player.outputElement.hidden = true;

                        self._player.play();

                        var geometry = new self.glWidget.THREE.CubeGeometry(200, 200, 200);
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
