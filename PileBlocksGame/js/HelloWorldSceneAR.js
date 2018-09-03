'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroDirectionalLight,
  ViroSpotLight,
  ViroText,
  Viro3DObject,
  ViroAmbientLight,
  ViroConstants,
  ViroQuad,
  ViroNode,
  ViroSphere, 
  ViroBox,
  ViroMaterials
} from 'react-viro';


const MODEL_TYPES = ["Maya Cube", "Sphere", "Box", "Rocks"]

export default class HelloWorldSceneAR extends Component {

  state = {
    modelMap: [],
    isTracking: false,
    initialized: false
  }

  getUIText(uiText){
    return (
      <ViroText 
        text={uiText} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} transformBehaviors={["billboardX", "billboardY"]}
      />
    )
  }

  getModelByType(modelType, index) {
    switch (modelType) {
      case "Maya Cube":
        return (
          <ViroNode 
            key={index}
            position={[0, 0, -1]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
          >
              <Viro3DObject 
                source={require("./res/models/MayaCube/Aztec.vrx")}
                scale={[.01,.01,.01]}
                resources={[
                  require('./res/models/MayaCube/FbxAztec.fbm/ROCK04L.JPG'),
                  require('./res/models/MayaCube/FbxAztec.fbm/ROCK04LB.JPG'),
                ]}
                type="VRX"
              />
              <ViroQuad 
                key="floor"
                height={.01}
                width={.01}
                rotation={[-90,0,0]}
                arShadowReceiver={true}
              />
          </ViroNode>
        )
      case "Sphere":
        return (
          <ViroSphere
            key={index}
            height={.01}
            width={.01}
            position={[1, 1, -1]} 
            materials={["metal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
          />
        )
      case "Rocks":
        return (
          <Viro3DObject position={[0, 0 -1 ]} 
            key={index}
            scale={[0.1,0.1,0.1]}
            type="OBJ"
            source={require('./res/models/Rock_6_FREE/Rock_6/Rock_6.obj')}
            materials={["rock"]}
            shadowCastingBitMask={2}
            dragType="FixedToWorld"
            onDrag={() => {}}
          />
        )
      default:
        return (
          <ViroBox
            key={index}
            height={.5}
            width={.5}
            position={[0, 1, -1]} 
            materials={["crystal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
          />
        )
    }
  }

  getRandomModel(){
    const randomType = Math.floor(Math.random() * 4)
  }

  getARScene(){
    return (
      <ViroNode>
        <ViroText text="Load Model" onClick={() => {
          this.setState({
            modelMap: [
              ...this.state.modelMap,
              MODEL_TYPES[Math.floor(Math.random() * 4)]
            ]
          })
        }}
        scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} transformBehaviors={["billboardX", "billboardY"]}
        />
        { 
          this.state.modelMap.map((
            modelType, index) => this.getModelByType(modelType, index)
          ) 
        }
      </ViroNode>
    )
  }
 
  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized}>
        <ViroDirectionalLight color="#ff1"
          direction={[0, -1, 0]}
          shadowOrthographicPosition={[0, 8, -2]}
          shadowOrthographicSize={10}
          shadowNearZ={2}
          shadowFarZ={9}
          castsShadow={true} 
        />
        <ViroSpotLight
          color="#FF22FF"
          attenuationStartDistance={2}
          attenuationEndDistance={6}
          position={[0, -5, 5]}
          direction={[0 -1, 0]}
          innerAngle={0}
          outerAngle={45}
        />
        { 
          this.state.isTracking ? 
          this.getARScene() : 
          this.getUIText(
            this.state.initialized ? "Initializing" : "No Tracking"
          )  
        }
      </ViroARScene>
    );
  }

  _onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        isTracking : true,
        initialized: true
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      this.setState({
        isTracking: false
      })
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

ViroMaterials.createMaterials({
  rock: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_d.png'),
    normalTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_n.png'),
    specularTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_s.png'),
    ambientOcclusionTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_ao.png')
  },
  alien: {
    lightingModel: "Blinn",
    diffuseTexture: require('./res/textures/Alien_Flesh_001_color.jpg'),
    normalTexture: require('./res/textures/Alien_Flesh_001_norm.jpg'),
    specularTexture: require('./res/textures/Alien_Flesh_001_spec.jpg')
  },
  lava: {
    lightingModel: "Constant",
    diffuseTexture: require("./res/textures/Lava_001_COLOR.png"),
    normalTexture: require("./res/textures/Lava_001_NRM.png"),
    specularTexture: require('./res/textures/Lava_001_SPEC.png')
  },
  crystal: {
    lightingModel: "Lambert",
    diffuseTexture: require("./res/textures/Crystal_002_COLOR.jpg"),
    normalTexture: require("./res/textures/Crystal_002_NORM.jpg")
  },
  red: {
    lightingModel: "Constant",
    diffuseColor: "#ff0335"
  },
  metal: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/textures/Metal_grunge_001_COLOR.jpg'),
    normalTexture: require('./res/textures/Metal_grunge_001_NRM.jpg'),
    specularTexture: require('./res/textures/Metal_grunge_001_SPEC.jpg')
  }
})

module.exports = HelloWorldSceneAR;
