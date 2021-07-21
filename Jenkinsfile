pipeline {
  agent any
    
  stages {
    
    dir("folder") {
       sh "pwd"
    
        
    stage('Build') {
      steps {
        sh 'npm install'
         sh 'npm start'
      }
    }  
    }
            
    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}
