import * as THREE from "three";
import React, { useEffect, useState, useMemo, useCallback} from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_aa",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export default function Avatar(props) {
  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'welcome',
      options: ['welcome', 'angry'],
    }
  });

  const { nodes, materials } = useGLTF('/model/avatar.glb');

  const { animations: idle } = useFBX('/animations/Idle.fbx'); 
  const { animations: waving } = useFBX('/animations/Waving.fbx'); 
  const { animations: angry } = useFBX('/animations/Angry.fbx'); 

  idle[0].name = 'idle';
  waving[0].name = 'waving';
  angry[0].name = 'angry';

  const [ animation, setAnimation ] = useState("idle");

  const { ref, actions } = useAnimations([idle[0], waving[0], angry[0]]);

  useEffect(() => {
    actions[animation]?.reset()?.fadeIn(0.5)?.play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [actions, animation]);

  const audio = useMemo(() => new Audio(`/audios/${script}.ogg`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `/Rhubarb-Lip-Sync-1.13.0-Windows/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;

    for (const key in corresponding) {
      if (Object.hasOwnProperty.call(corresponding, key)) {
        const value = corresponding[key];
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]]
        = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]]
        = 0;
      }
    }

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      if (currentAudioTime >= lipsync.mouthCues[i].start && currentAudioTime <= lipsync.mouthCues[i].end) {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[lipsync.mouthCues[i].value]]]
        = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[lipsync.mouthCues[i].value]]]
        = 1;
        break;
      }
    }

    audio.ended && setAnimation("idle");
    audio.ended && setAnimation("idle");
  })

  const handelAnimationAndAudio = useCallback((action, audio) => {
    if (playAudio) {
      setAnimation(action);
      audio.play();
    } else {
      setAnimation("idle");
      audio.pause();
    }
    audio.paused | audio.ended && setAnimation("idle");
  }, [playAudio]);

  useEffect(() => {
    script === "welcome" ? handelAnimationAndAudio("waving", audio) : handelAnimationAndAudio("angry", audio);
  }, [script, handelAnimationAndAudio, audio]);

  return (
    <group {...props} dispose={null} ref={ref}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('/model/avatar.glb');