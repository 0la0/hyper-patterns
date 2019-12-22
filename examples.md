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

---
## Reactive message handling

---
## MIDI

### MIDI in
```html
```

### MIDI out
```html
```
