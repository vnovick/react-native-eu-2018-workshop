'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroFlexView,
  ViroARPlaneSelector,
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
const GAME_STATES = {
  GAME_STARTED: "GAME_STARTED",
  IN_GAME: "IN_GAME",
  GAME_OVER: "GAME_OVER"
}

export default class HelloWorldSceneAR extends Component {

  state = {
    gameState: GAME_STATES.GAME_STARTED,
    modelMap: [],
    score: 0,
    loadingModelType: '',
    isModelLoading: false,
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
          <Viro3DObject 
            key={index}
            position={[0,1,0]}
            dragType="FixedToWorld"
            onDrag={() => {}}
            source={require("./res/models/MayaCube/Aztec.vrx")}
            scale={[.01,.01,.01]}
            resources={[
              require('./res/models/MayaCube/FbxAztec.fbm/ROCK04L.JPG'),
              require('./res/models/MayaCube/FbxAztec.fbm/ROCK04LB.JPG'),
            ]}
            type="VRX"
            physicsBody={{
              type:'Dynamic', 
              shape:{type:'Box', params:[0.1,0.1,0.1]},
              mass: 1,
            }}
            onLoadEnd={() => this.setState({
              isModelLoading: false,
              loadingModelType: ''
            })}
          />
        )
      case "Sphere":
        return (
          <ViroSphere
            key={index}
            radius={.05}
            position={[0, 1, 0]}
            materials={["metal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic',
              mass: 1,
            }}
          />
        )
      case "Rocks":
        return (
          <Viro3DObject
            key={index}
            position={[0, 1, 0]}
            scale={[0.1,0.1,0.1]}
            type="OBJ"
            source={require('./res/models/Rock_6_FREE/Rock_6/Rock_6.obj')}
            materials={["rock"]}
            dragType="FixedToWorld"
            onLoadEnd={() => this.setState({
              isModelLoading: false,
              loadingModelType: ''
            })}
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: 1,
            }}
          />
        )
      default:
        return (
          <ViroBox
            key={index}
            height={.05}
            width={.05}
            length={.05}
            position={[0, 1, 0]}
            materials={["crystal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              shape:{type:'Box', params:[0.05,0.05,0.05]},
              mass: 1,
            }}
          />
        )
    }
  }

  getRandomModel(){
    const randomType = Math.floor(Math.random() * 4)
  }

  onPlaneSelected = (anchorMap) => {
    const worldCenterPosition = [
      anchorMap.position[0] + anchorMap.center[0],
      anchorMap.position[1] + anchorMap.center[1],
      anchorMap.position[2] + anchorMap.center[2]
    ];
    this.setState({
      foundPlane: true, 
      worldCenterPosition, 
    })
  }

  loadModel = () => {
    const loadingModelType = MODEL_TYPES[Math.floor(Math.random() * 4)]
    this.setState({
      isModelLoading: true,
      loadingModelType,
      score: this.state.score + 100,
      modelMap: [
        ...this.state.modelMap,
        loadingModelType
      ]
    })
  }

  reset = () => {
    this.setState({
      score: 0,
      modelMap: [],
      foundPlane: false,
      gameState: GAME_STATES.GAME_STARTED
    })
  }

  getHUDControl() {
    return (
      <ViroNode position={this.state.worldCenterPosition}>
        <ViroNode position={[0, 1, -2]} >
          <ViroFlexView 
            style={{flexDirection: 'column'}} 
            width={1} 
            height={0.8} 
            materials="hud_text_bg" 
            position={[-1.5,0,0]}
            onClick={this.reset}
          >
            <ViroText style={styles.helloWorldTextStyle} text="Reset Game" />
          </ViroFlexView>
          <ViroFlexView 
            style={{flexDirection: 'column'}} 
            width={1} 
            height={0.8} 
            materials="hud_text_bg" 
            position={[0,0,0]}
          >
            <ViroText style={styles.helloWorldTextStyle} text="Score:" />
            <ViroText style={styles.helloWorldTextStyle}  text={`${this.state.score}`} />
          </ViroFlexView>
          <ViroFlexView 
            style={{flexDirection: 'column'}} 
            width={1} 
            height={0.8} 
            materials="hud_text_bg" 
            position={[1.5,0,0]} 
            onClick={this.loadModel}
          >
            <ViroText 
              text={this.state.isModelLoading ? `Loading...${this.state.loadingModelType}`: "Load Model"}
              style={styles.helloWorldTextStyle} 
            />
          </ViroFlexView>
        </ViroNode>
      </ViroNode>

      
    )
  }

  onCollide = () => {
    this.setState({
      gameState: GAME_STATES.GAME_OVER,
      modelMap: [],
      foundPlane: false
    })
  }

  
  getARScene(){
    switch (this.state.gameState) {
      case GAME_STATES.GAME_STARTED: 
        return (
          <ViroFlexView style={{flexDirection: 'column'}} width={4} height={0.8} position={[0,0, -3 ]} transformBehaviors={["billboardX", "billboardY"]}>
            <ViroText 
              text="Welcome to PileBoxAR." style={styles.hud_text}/>
            <ViroText 
              text="Select Plane. Pile boxes on the plane."
              style={styles.hud_text}/>
            <ViroText text="Continue" style={styles.hud_text} onClick={() => this.setState({
              gameState: GAME_STATES.IN_GAME
            })}/>
          </ViroFlexView>
        )
      case GAME_STATES.IN_GAME:
        return (
          <ViroNode>
            { this.state.foundPlane && this.getHUDControl() }
            <ViroARPlaneSelector onPlaneSelected={this.onPlaneSelected}
              ref={(selectorRef) => this.arSelectorRef = selectorRef}
            >
              { 
                this.state.modelMap.map((
                  modelType, index) => (
                    <ViroNode key={index}>
                      { this.getModelByType(modelType, index) }
                      <ViroQuad 
                        arShadowReceiver={true}
                        position={[0,0,0]}
                        height={10}
                        width={10}
                        rotation={[-90, 0, 0]}
                      />
                    </ViroNode>
                  )
                ) 
              }
            <ViroQuad 
              key="surface"
              rotation={[-90, 0, 0]}
              materials={["collider"]}
              physicsBody={{ type:'Static', restitution:0.3, friction: 0.3 }}
            />
            <ViroQuad 
              key="deadZone"
              height={100}
              width={100}
              rotation={[-90, 0, 0]}
              position={[0,-3,0]}
              materials={["deadZone"]}
              physicsBody={{ type:'Static', restitution:0.3 }}
              onCollision={this.onCollide}
            />
            </ViroARPlaneSelector>
          </ViroNode>
        )
      case GAME_STATES.GAME_OVER:
        return (
          <ViroFlexView 
            style={{flexDirection: 'column'}} 
            width={1} 
            height={0.8} 
            position={[0,0, -3 ]} 
            transformBehaviors={["billboardX", "billboardY"]}
          >
            <ViroText text="Game Over"/>
            <ViroText text="reset game" onClick={this.reset}/>
          </ViroFlexView>
        )
    }
  }
 
  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="rgba(123,123,321,.5)" intensity={100}/> 
        <ViroDirectionalLight color="#ffffff"
          direction={[0, -1, 0]}
          shadowOrthographicPosition={[0, 8, -2]}
          shadowOrthographicSize={10}
          shadowNearZ={2}
          shadowFarZ={9}
          castsShadow={true} 
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
    fontSize: 10,
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
  hud_text_bg: {
    lightingModel: "Constant",
    diffuseColor: "rgba(123,123,231,.4)"
  },
  collider: {
    diffuseColor: "rgba(0,0,0,.2)"
  },
  deadZone: {
    diffuseColor: "rgba(0,0,0,0)"
  },
  metal: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/textures/Metal_grunge_001_COLOR.jpg'),
    normalTexture: require('./res/textures/Metal_grunge_001_NRM.jpg'),
    specularTexture: require('./res/textures/Metal_grunge_001_SPEC.jpg')
  }
})

module.exports = HelloWorldSceneAR;
