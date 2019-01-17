var secretary;

function _secretary(cln) {
    let me = this;
    this.cln = cln;
    this.uid = Date.now();
    let interimHolder = document.createElement("p");
    this.vocoder = new _vocoder();
    this.vocoder.on("final",(result)=>{
        me.cln.doc(String(Date.now())).set({
            uid: me.uid,
            text: result
        });
    })
    this.vocoder.on("interim",(result)=>{
        interimHolder.innerText = result;
    })
    document.body.appendChild(interimHolder);
    interimHolder.style.color = "green";
    this.cln.onSnapshot((shot) => {
        shot.docChanges().forEach((c) => {
            let data;
            switch (c.type) {
                case "added":
                    data = c.doc.data();
                    pp = document.createElement("p");
                    pp.classList.add(c.doc.id);
                    pp.innerHTML = `<em>` + data.uid + `</em>:` + data.text+ `<em class="date">` + (new Date(Number(c.doc.id))).toLocaleString() + `</em>`;
                    document.body.appendChild(pp);
                    break;
                case "changed":
                    data=c.doc.data();
                    pp=document.getElementsByClassName(c.doc.id)[0];
                    pp.innerHTML = `<em>` + data.uid + `</em>:` + data.text + `<em class="date">` + (new Date(Number(c.doc.id))).toLocaleString() + `</em>`;
                    break;
            }
        })
    });
    $("#uid").on("change",(e)=>{
        me.uid=e.currentTarget.value;
    })
}








$(() => {
    fireman = new _fireman({
        documentQueryKeyword: "room",
        load: (doc, id) => {
            secretary = new _secretary(doc.collection('messages'));
        },
        autocreate: true,
        makeNewDocument: function (doc, id) {
            secretary = new _secretary(doc.collection('messages'));
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