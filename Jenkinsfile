pipeline {
  agent any
  stages {
    stage('docker'){
      steps {
      def dockerHome=tool name: 'docker', type: 'dockerTool'
      echo "${dockerHome}"
      }
    }
    stage("build") {
      steps {
        sh """
          docker build .
        """
      }
    }
    stage("run") {
      steps {
        sh """
          docker run
        """
      }
    }
  }
}
