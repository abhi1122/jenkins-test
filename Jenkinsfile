pipeline {
  agent any
  tools {dockerTool "docker-compose"}
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
