# Examples

## Sequences

### A simple pattern
```html
<h-seq>
  <h-pat pattern="332 664 332 664"></h-pat>
</h-seq>
```

### A sequence of patterns
```html
<h-seq>
  <h-pat pattern="332 664 332 664"></h-pat>
  <h-pat pattern="332 , 332 "></h-pat>
</h-seq>
```

### Sub-patterns
```html
<h-seq>
  <h-pat pattern="332 664 [332 664]"></h-pat>
  <h-pat pattern="332 [ 332 664 [332 664]]"></h-pat>
</h-seq>
```

### Addresses
```html
<h-seq>
  <h-pat address="a" pattern="332 664 332 664"></h-pat>
</h-seq>

<h-seq>
  <h-pat pattern="a:332 b:664 a:332 c:664"></h-pat>
</h-seq>
```
---
## Pattern modifiers

### Degrade
Each element has a probability of being included in the sequence [0, 1]. Evaluated each time the pattern is run.
```html
<h-seq>
  <h-pat-mod degrade="0.8" mtof>
    <h-pat address="a" pattern="52 60 65 72" />
    <h-pat address="a" pattern="60 65 60" />
  </h-pat-mod>
</h-seq>
```

### Frequency to MIDI
Convert frequency values in pattern to corresponding MIDI notes.
```html
<h-seq>
  <h-pat-mod ftom>
    <h-pat address="a" pattern="332 440 332" />
  </h-pat-mod>
</h-seq>
```

### MIDI to frequency
Convert MIDI values in pattern to corresponding frequency values.
```html
<h-seq>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
    <h-pat address="a" pattern="60 65 60" />
  </h-pat-mod>
</h-seq>
```

### Offset
Delay the start of the pattern [0, 1], where 0 is no change and 1 will delay the pattern by 1 pattern length.
```html
<h-seq>
  <h-pat-mod mtof offset="0.5">
    <h-pat address="a" pattern="52 60 65 72" />
    <h-pat address="a" pattern="60 65 60 58" />
  </h-pat-mod>
</h-seq>
```

### Repeat
Repeat the child patterns n times.
```html
<h-seq>
  <h-pat-mod mtof repeat="3">
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="60 65 60 58" />
  </h-pat-mod>
</h-seq>
```

### Reverse
Reverse the elements of a pattern
```html
<h-seq>
  <h-pat-mod mtof reverse>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>
```

### Rotate
Rotate the elements of a pattern [0, 1]
```html
<h-seq>
  <h-pat-mod mtof rotate="0.25">
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>
```

### Speed
Modify the speed of a pattern [0,n], where 0.5 is twice as fast and 2 is twice as slow.
```html
<h-seq>
  <h-pat-mod mtof speed="0.5">
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
  <h-pat-mod mtof speed="2">>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>
```

### Arpeggiator
Arpeggiate a pattern
 * step: integer [1,n]
   - distance between notes in semi-tones
 * distance: integer [-n,n]
    - number of sem-tones in arpeggiation
 * rate: float [0, n]
    - speed of arpeggiation where 0.5 is twices as fast and 2 is twice as slow
 * repeat: integer [1, n]
    - number of times the arpeggiation is repeated
```html
<h-seq>
  <h-pat-mod mtof speed="1">
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>
```

---
## Reactive message handling

### Message inlet
```html
<h-seq>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>

<!-- This element receives pattern elements with an address of "a" -->
<h-msg-inlet address="a">
<h-msg-inlet>
```

### Message outlet
```html
<h-seq>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>

<!-- This element broadcasts messages to address "b" -->
<h-msg-outlet address="b">
  <h-msg-inlet address="a">
  <h-msg-inlet>
</h-msg-outlet>
```

### Filter
value: fn, asMidi
every: fn, asMidi
```html
<h-seq>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>

<!-- This example filters all messages with a value less than MIDI 59 -->
<h-msg-outlet address="b">
  <h-msg-filter value="asMidi(v >= 59)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>

<!-- OR -->

<!-- This example filters all messages with a value less frequency value 440 -->
<h-msg-outlet address="b">
  <h-msg-filter value="fn(v >= 440)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>

<!-- OR -->

<!-- This example filters every other message -->
<h-msg-outlet address="b">
  <h-msg-filter every="fn(t % 2 === 0)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>
```

### Map
value: fn, asMidi
time: fn, asMidi
```html
<h-seq>
  <h-pat-mod mtof>
    <h-pat address="a" pattern="52 60 65 72" />
  </h-pat-mod>
</h-seq>

<!-- This example maps add 3 semitones to incoming messages -->
<h-msg-outlet address="b">
  <h-msg-map value="asMidi(v + 3)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>

<!-- OR -->

<!-- This example maps add the value 10 to incoming messages-->
<h-msg-outlet address="b">
  <h-msg-map value="fn(v + 10)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>

<!-- OR -->

<!-- This example delays incoming messages by 120 milliseconds -->
<h-msg-outlet address="b">
  <h-msg-map time="fn(t + 120)">
    <h-msg-inlet address="a"></h-msg-inlet>
  </h-msg-filter>
</h-msg-outlet>

```

---
## MIDI

### MIDI in
Name: string - the midi device name
```html
this example broadcasts messages from a MIDI device to the address "a"
<h-msg-outlet address="a">
  <h-midi-in name="Launchpad-Mini"></h-midi-in>
</h-msg-outlet>
```

### MIDI note out
```html
<!-- trigger from value -->
<h-midi-note-out
  name="TR-08"
  channel="9"
  note="37"
  value="trigger(b)"
  notelength="100"
>
</h-midi-note-out>

<!-- trigger from note -->
<h-midi-note-out
  name="TR-08"
  channel="9"
  note="trigger(a)"
  value="addr(b)"
  notelength="100"
>
</h-midi-note-out>

<!-- trigger from child -->
<h-midi-note-out
  name="TR-08"  
  channel="9"
  note="60"
  value="127"
  notelength="100"
>
  <h-seq>
    <h-pat pattern="52 60 65 72" />
  </h-seq>
</h-midi-note-out>
```
