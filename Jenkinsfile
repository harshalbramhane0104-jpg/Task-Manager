pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'harshbramhane'  // <-- change this
    }

    stages {
        stage('Code') {
            steps {
                echo 'Cloning the code'
                git url: 'https://github.com/harshalbramhane0104/Task-Manager.git', branch: 'main'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/library-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/library-frontend:latest ./frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKERHUB_USER/library-backend:latest
                        docker push $DOCKERHUB_USER/library-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose down || true
                    docker rm -f library_frontend_cont library_backend_cont library_db_cont || true
                    docker compose pull
                    docker compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    sleep 10
                    curl -f http://localhost:5000/health
                    curl -f http://localhost:80
                '''
            }
        }
    }
}
