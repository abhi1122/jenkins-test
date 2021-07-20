pipeline {
  agent any
  stages {
    stage("docker"){
      def dockerHome=tool name: 'docker', type: 'dockerTool'
      steps {
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
