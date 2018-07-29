<template>
  <div id="chat" class="container">
    <!-- Messages -->
    <div id="message-contents">
    <div v-for="message in messages" :key="message.id" class="message-wrapper is-clearfix">
      <div class="box has-background-primary" v-bind:class="{'mymessage' : isMyMessage(message), 'mymassage-box' : isMyMessage(message)}">
        <div class="content" >
        <p><strong>{{ message.nickname }}</strong>
        <br />
        {{ message.text }}</p>
        </div>
      </div>
      </div>
    </div>      
    <!-- <hr> -->

      <footer>
          <div class="field is-horizontal"> 
              <div class="field-body">
                <div class="field">
                  <p class="control is-expanded has-icons-left">
                    <!-- <input class="input" type="text" placeholder="Name"> -->
                    <input class="input" v-model="nickname" type="text" placeholder="ユーザー名">
                    <span class="icon is-small is-left">
                      <i class="fas fa-user"></i>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <p class="control is-expanded has-icons-left has-icons-right">
                    <input class="input is-success" v-model="messageText" type="text" placeholder="メッセージ">
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right">
                      <i class="fas fa-check"></i>
                    </span>
                  </p>
                </div>
                <p class="control">
                  <button class="button is-success" @click="storeMessage">
                    Send
                  </button>
                  </p>
              </div>
            </div>            
      </footer>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "Main",
  data() {
    return {
      name: firebase.auth().currentUser.email, 
      messages: [],
      messageText: '',
      nickname: '',
      uid: '',
      createAt: ''
    };
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin");
        });
    },
    storeMessage: function() {
      let self = this
      if(this.messageText === ""){
        alert("メッセージを入力してください")
      }else if(this.nickname === ""){
        alert("スクリーンネームをいれてください")
      }else{
        firebase.auth().currentUser.updateProfile({
            displayName: this.nickname,
          }).then(function() {
            // Update successful.

          }).catch(function(error) {
            console.log(error)
          });

        firebase.firestore().collection("messages").add({
              name: this.nickname,
              message: this.messageText,
              uid: firebase.auth().currentUser.uid,
              createAt: (new Date()).toString()
            }).then(function(docRef) {
                self.messageText = ''
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
      }

    }, 
    isMyMessage: function(message) {
      return firebase.auth().currentUser.uid == message.uid
    }
  },

  created() {
    const self = this
    firebase.firestore().collection("messages").orderBy("createAt", "asc").onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
              self.messages.push({nickname: change.doc.data().name , text: change.doc.data().message, uid: change.doc.data().uid})
            }          
          });
        });
    this.nickname = firebase.auth().currentUser.displayName
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
p {
  text-align: left;
}
#message-contents{
    z-index:1;
    padding: 55px 10px 76px 10px;
    background:#ffffff;
}

.message-wrapper{
    margin:20px 10px;
}

.message-wrapper .box{
    float:left;
}

.mymassage-box {
  background-color: #9ADD62
}

.message-wrapper .box.mymessage{
    float:right;
}

.mymessage p{
    text-align: right;
}

footer{
    position:fixed;
    bottom:0px;
    width:80%;
    height:66px;
    padding-top: 10px;
    border-top:1px solid #aaaaaa;
    background:#ffffff;
}
</style>
