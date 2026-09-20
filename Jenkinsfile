pipeline {
    agent any
    stages {
        stage('checkout') {
            steps {
                echo 'checkout repository...'
                checkout scm
            }
        }
        stage('build') {
            steps {
                echo 'building project...'
                sh 'npm install'
            }
        }
        stage('package') {
            steps {
                echo 'packing project...'
                sh 'npm run build'
            }
        }

    }
}