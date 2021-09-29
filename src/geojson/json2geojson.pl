#!/usr/bin/perl
# -I /usr/lib/perl/5.6.1
# -I/home/forecast/dnmi/lib/perl5/site_perl/5.6.1/IP27-irix
#
# Extract svg-icons for use in chart
#
use strict;
use JSON; # imports encode_json, decode_json, to_json and from_json.                          
use Data::Dumper;

sub Usage {                      
    print STDERR "
Usage: create.pl -f <file1.json> <file2.json> ... -o <output.json> 

Create geojson from multiple json-polygon-files
\n";                             
    exit 1;                      
}                                
#
my $output="output.json";  ## output json file
my @files;
my $feature;
my $cmd;
my @args = @ARGV;
for my $arg (@args) {
    if ($arg =~ m/^\-(.+)/) {
	$cmd=$1;
    } elsif (defined $cmd) {
	if ($cmd eq "f") { # change input file
	    push(@files,$arg);
	} elsif ($cmd eq "o") {  # set output file
	    $output=$arg;
	}
    };
}
print "> Reading input\n";
my $json=&makeCollection();
## loop through input
for my $file (@files) {
    if ($file =~ m/([^\/]*)\.json/) {
	my $name=$1;
	## get input file content
	print ">> Reading $file\n";
	my $str=readJsonFile($file);
	my $ft=&makeFeature($name,$str);
	my $fts=$json->{"features"};
	push(@{$fts},$ft);
    }
}

if (defined $json && defined $output) {
    print "> Output $output\n";
    ## open output file
    open(FOH, '>', $output) or die $!;
    ## write header
    print FOH "export default ";
    print FOH encode_json $json;
    ## write tail
    print FOH "\n";
    ## close output file
    close (FOH);
} else {
    die "> No output $output";
}

sub makeCollection {
    return ({type=>"FeatureCollection",features=>[]});
};

# $name="Belize"
# @coordinates= [  [[-89.14308041050332,17.80831899664932],[-89.15090938999553,17.95546763760042]]  ]
sub makeFeature {
    my $name=shift;
    my $coordinates=shift;
    return ({  type=>"Feature",
	       properties=>{admin=>$name},
	       geometry=>{type=>"Polygon",coordinates=>$coordinates}  });	
} 
		   
sub getJsonAdmin{
    my $str=shift;
    my $trg=shift;
    my @fts=@{$str->{"features"}};
    if (@fts) {
	for my $ft (@fts) {
	    if ($ft->{"properties"}->{"admin"} eq $trg) {
		return $ft;
	    }
	}
    } else {
	print "    No features found...\n";
    }
    return;
}


sub readJsonFile {
    my $file=shift;
    my $str="";
    open(FIH, '<', $file) or die $!;
    while (my $line=<FIH>){
	$str=$str . $line;
    };
    close(FIH);
    ## look for features
    my $json=decode_json $str;
    ## $json is flat, i.e.: [p1,p2,p3,p4...,p1,p100,p101...p100,p1,p200...p200]
    ## should be : [[p1,p2,p3,p4...p1],[p100,p101,...,p100],[p200,...,p200]]
    my $firstlat;
    my $firstlng;
    my $ret;
    my $cur=[];
    foreach my $pos (@{$json}) {
	my $lat=$pos->[0];
	my $lng=$pos->[1];
	if ($firstlat && $firstlng) {
	    if ($firstlat eq $lat && $firstlng && $firstlng eq $lng) {
		if (! $ret) { # end of first segment
		    $ret=[];
		    push(@${cur},[$lng,$lat]);
		};
		if (scalar(@${cur})>2) {push(@{$ret},$cur);};
		$cur=[];
	    } else {
		push(@${cur},[$lng,$lat]);
	    };
	} else {
	    push(@${cur},[$lng,$lat]);
	    $firstlat=$lat;
	    $firstlng=$lng;
	}
	
    }
    if (scalar(@${cur})>0) {push(@{$ret},$cur);};
    return ($ret);
}
