pipeline {
  agent any
  tools {docker-compose "docker-compose"}
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
