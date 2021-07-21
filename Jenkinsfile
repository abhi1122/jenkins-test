pipeline {
  agent any
  tools {docker22 "docker-compose"}
  stages {
    stage("build") {
      steps {
        sh """
          docker-compose build
        """
      }
    }
  }
}
