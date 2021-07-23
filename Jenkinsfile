pipeline {
  agent any
  tools {dockerTool "docker"}
  stages {
    stage("build") {
      steps {
        sh """
          docker build -t docker_build .
        """
      }
    }
    stage("run") {
      steps {
        sh """
          docker run --rm docker_build
        """
      }
    }
  }
}
