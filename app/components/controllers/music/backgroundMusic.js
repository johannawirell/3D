import * as THREE from 'three'

const PATH_TO_AUDIO = './sounds/background.mp3'

export class BackgroundMusic {
    constructor({camera}) {
        this.camera = camera
        this.#loadAudio()

         window.addEventListener('click', () => {
            if (this.isDone) {
                this.backgroundSound.play()
            }
            
        })
    }

    #loadAudio() {
        this.audioLoader = new THREE.AudioLoader()
        this.#createAudioListener()
        this.#loadBackgroundSound()
    }

    #createAudioListener() {
        this.listener = new THREE.AudioListener()
        this.camera.add(this.listener)
    }

    #loadBackgroundSound() {
        this.backgroundSound = new THREE.Audio(this.listener)

        this.audioLoader.load(PATH_TO_AUDIO, buffer => {
            this.backgroundSound.setBuffer(buffer)
            this.backgroundSound.setLoop(true),
            this.backgroundSound.setVolume(0.4)
            this.isDone = true
            console.log('done loading audio')
        })       
    }
}