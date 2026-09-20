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
    }
}