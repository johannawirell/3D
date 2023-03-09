self.onmessage = (m) => {
    if (m.data.subject === 'dosomething') {
        console.log(m.data.subject)
        m.data.data.push(4, 5, 6)
        postMessage(m.data)
    }
}