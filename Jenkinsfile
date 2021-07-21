pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Build') {
      steps {
        sh 'npm install'
         sh 'npm start'
      }
    }  
    
            
    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}
