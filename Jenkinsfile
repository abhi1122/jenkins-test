pipeline {
  agent any
  tools {dockerTool "docker"}
  stages {
    stage("build") {
      steps {
        sh """
          docker build
        """
      }
    }
  }
}
