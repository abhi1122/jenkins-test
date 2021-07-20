pipeline {
  agent any
  stages {
    stage('Initialize'){
        def dockerHome = tool 'myDocker'
        env.PATH = "${dockerHome}/bin:${env.PATH}"
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
