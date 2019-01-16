function _secretary(cln) {
    let me = this;
    this.cln = cln;
    this.uid = Date.now();
    let interimHolder = document.createElement("p");
    document.body.appendChild(interimHolder);
    interimHolder.style.color = "green";
    this.cln.onSnapshot((shot) => {
        shot.docChanges().forEach((c) => {
            switch (c.type) {
                case "added":
                    let data = c.doc.data();
                    pp = document.createElement("p");
                    pp.innerHTML = `<em>` + data.uid + `</em>:` + data.text;
                    document.body.appendChild(pp);
                    break;
            }
        })
    });
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                me.cln.doc(String(Date.now())).set({
                    uid: me.uid,
                    text: transcript
                });
                recognition.start();
            } else {
                interimTranscript += transcript;
            }
        }
        interimHolder.innerText = interimTranscript;
    }
    recognition.start();
}








$(() => {
    fireman = new _fireman({
        documentQueryKeyword: "room",
        load: (doc, id) => {
            let s = new _secretary(doc.collection('messages'));
        },
        autocreate: true,
        makeNewDocument: function (doc, id) {
            let s = new _secretary(doc.collection('messages'));
        },
        passwall: true,
        autopass: true,
        passwordKeyname: "password",
        generateDoc: function (db, docName) {
            return db.collection("secretary").doc(docName);
        },
        config: {
            apiKey: "AIzaSyA-sH4oDS4FNyaKX48PSpb1kboGxZsw9BQ",
            authDomain: "backbits-567dd.firebaseapp.com",
            databaseURL: "https://backbits-567dd.firebaseio.com",
            projectId: "backbits-567dd",
            storageBucket: "backbits-567dd.appspot.com",
            messagingSenderId: "894862693076"
        }
    })
});